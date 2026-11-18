import { createElement, useEffect, useRef, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router";

import {
  GROWTH_AD_ACCOUNT_PARAM,
  GROWTH_ORGANIC_ACCOUNT_PARAM,
} from "../../constants/shared/growthUrlParams";
import { useGrowthPaths } from "../../hooks/shared/useGrowthPaths";
import { AssistantMark } from "../components/AssistantMark";
import type { AssistantStatus } from "../types/components";
import { resolveAssistantChatScope } from "../utils/assistantChatScope";
import {
  clearAssistantSession,
  loadAssistantSession,
  saveAssistantSession,
} from "../utils/assistantSessionStorage";
import { runAssistantTool } from "../utils/assistantTools";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { streamAssistantTurn } from "@/services/assistantService";
import type {
  AssistantContent,
  AssistantMessage,
  AssistantPart,
} from "@/shared/types/assistant";
import { showToast } from "@/shared/utils/showToast";

const MAX_STEPS = 8;
const MAX_HISTORY = 30;
const NO_ANSWER = "I couldn't find an answer to that. Try asking another way.";
const READY_TOAST = "Pulse is ready with a reply";
const WAITING_TOAST = "Pulse is waiting for you to open the chat";

function trimHistory(history: AssistantContent[]): AssistantContent[] {
  if (history.length <= MAX_HISTORY) return history;
  const start = history.findIndex(
    (content, index) =>
      index >= history.length - MAX_HISTORY &&
      content.role === "user" &&
      content.parts.some((part) => part.text),
  );
  return start > 0 ? history.slice(start) : history;
}

function pulseToastIcon() {
  return createElement(AssistantMark, {
    className: "size-4 shrink-0 text-primary",
  });
}

export type { AssistantStatus };

export function useAssistant() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const {
    campaignId = "",
    adsetId = "",
    adId = "",
    postId = "",
  } = useParams();
  const { basePath } = useGrowthPaths();
  const adAccountId = searchParams.get(GROWTH_AD_ACCOUNT_PARAM) ?? "";
  const organicAccountId =
    searchParams.get(GROWTH_ORGANIC_ACCOUNT_PARAM) ?? "";
  const chatScope = resolveAssistantChatScope({
    searchParams,
    campaignId,
    adsetId,
    adId,
    postId,
  });

  const [messages, setMessages] = useState<AssistantMessage[]>(() =>
    loadAssistantSession(chatScope).messages,
  );
  const [status, setStatus] = useState<AssistantStatus>("idle");
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusDetail, setStatusDetail] = useState<string | null>(null);

  const history = useRef<AssistantContent[]>(
    loadAssistantSession(chatScope).history,
  );
  const scopeRef = useRef(chatScope);
  const messagesRef = useRef(messages);
  const statusRef = useRef(status);
  const sheetOpenRef = useRef(false);
  const notifyWhenReadyRef = useRef(false);
  const displayName = user?.email?.split("@")[0] ?? "";

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (scopeRef.current === chatScope) return;
    scopeRef.current = chatScope;
    const next = loadAssistantSession(chatScope);
    history.current = next.history;
    messagesRef.current = next.messages;
    setMessages(next.messages);
    setError(null);
    setStreamingId(null);
    setStatusDetail(null);
    setStatus("idle");
    statusRef.current = "idle";
  }, [chatScope]);

  function persist(nextMessages: AssistantMessage[] = messagesRef.current) {
    messagesRef.current = nextMessages;
    saveAssistantSession(scopeRef.current, {
      messages: nextMessages,
      history: history.current,
    });
  }

  function setSheetOpen(open: boolean) {
    sheetOpenRef.current = open;
    if (open) {
      notifyWhenReadyRef.current = false;
      return;
    }
    if (statusRef.current !== "idle") {
      notifyWhenReadyRef.current = true;
    }
  }

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || statusRef.current !== "idle" || !user) return;

    setError(null);
    setStatusDetail(null);
    setStatus("thinking");
    statusRef.current = "thinking";

    const nextMessages: AssistantMessage[] = [
      ...messagesRef.current,
      { id: crypto.randomUUID(), role: "user", text: trimmed },
    ];
    setMessages(nextMessages);
    persist(nextMessages);

    if (!sheetOpenRef.current) notifyWhenReadyRef.current = true;

    const context = {
      userName: displayName,
      today: new Date().toDateString(),
      currentPath: pathname,
      adAccountId,
      organicAccountId,
      campaignId,
      adsetId,
      adId,
      postId,
    };
    let contents = trimHistory([
      ...history.current,
      { role: "user" as const, parts: [{ text: trimmed }] },
    ]);
    const replyId = crypto.randomUUID();
    let shown = "";
    let paragraphBreak = false;

    function showText(piece: string) {
      const isFirst = !shown;
      shown = `${shown}${paragraphBreak && shown ? "\n\n" : ""}${piece}`;
      paragraphBreak = false;
      const text = shown;
      const updated = isFirst
        ? [
            ...messagesRef.current,
            { id: replyId, role: "assistant" as const, text },
          ]
        : messagesRef.current.map((message) =>
            message.id === replyId ? { ...message, text } : message,
          );
      setMessages(updated);
      persist(updated);
      setStreamingId(replyId);
      setStatus("streaming");
      statusRef.current = "streaming";
    }

    try {
      let finished = false;
      for (let step = 0; step < MAX_STEPS; step += 1) {
        const reply = await streamAssistantTurn(contents, context, showText);
        contents = [...contents, reply];
        const calls = reply.parts.filter((part) => part.functionCall);
        if (!calls.length) {
          history.current = contents;
          if (!shown) showText(NO_ANSWER);
          finished = true;
          break;
        }
        paragraphBreak = true;
        setStatus("thinking");
        statusRef.current = "thinking";
        const responses: AssistantPart[] = await Promise.all(
          calls.map(async ({ functionCall }) => ({
            functionResponse: {
              id: functionCall?.id,
              name: functionCall?.name ?? "",
              response: await runAssistantTool(
                user.id,
                functionCall?.name ?? "",
                functionCall?.args,
                basePath,
              ),
            },
          })),
        );
        contents = [...contents, { role: "user", parts: responses }];
      }
      if (!finished) {
        setError("That took too many steps. Try a more specific question.");
      }
    } catch (caught) {
      setError(
        (caught instanceof Error && caught.message) ||
          "The assistant is unavailable right now.",
      );
    } finally {
      history.current = contents;
      persist(messagesRef.current);
      setStatus("idle");
      statusRef.current = "idle";
      setStreamingId(null);
      setStatusDetail(null);

      if (notifyWhenReadyRef.current && !sheetOpenRef.current) {
        notifyWhenReadyRef.current = false;
        showToast("info", shown ? READY_TOAST : WAITING_TOAST, {
          icon: pulseToastIcon(),
        });
      }
    }
  }

  function reset() {
    history.current = [];
    notifyWhenReadyRef.current = false;
    clearAssistantSession(scopeRef.current);
    messagesRef.current = [];
    setMessages([]);
    setError(null);
    setStatusDetail(null);
  }

  return {
    messages,
    status,
    statusDetail,
    streamingId,
    error,
    ask,
    reset,
    displayName,
    setSheetOpen,
  };
}
