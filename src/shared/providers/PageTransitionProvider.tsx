import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Outlet,
  createPath,
  useLocation,
  useNavigate,
  type To,
} from "react-router";

import { PAGE_MAIN_MOTION } from "@/shared/constants/pageMotion";
import {
  PageTransitionContext,
  type PageTransitionContextValue,
} from "@/shared/providers/pageTransitionContext";
import { routePath } from "@/shared/utils/routePath";

const PageTransitionAnimationContext = createContext<{
  isVisible: boolean;
  onExitComplete: () => void;
} | null>(null);

function isSameRoute(pathname: string, search: string, to: To) {
  const current = routePath(createPath({ pathname, search }));
  return routePath(to) === current;
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [activePath, setActivePath] = useState(location.pathname);
  const pendingTo = useRef<To | null>(null);

  const finishTransition = useCallback(
    (to: To) => {
      pendingTo.current = null;
      navigate(to);
      setIsVisible(true);
    },
    [navigate],
  );

  const navigateWithTransition = useCallback(
    (to: To) => {
      if (isSameRoute(location.pathname, location.search, to)) return;

      setActivePath(routePath(to));
      pendingTo.current = to;

      if (!isVisible) {
        finishTransition(to);
        return;
      }

      setIsVisible(false);
    },
    [finishTransition, isVisible, location.pathname, location.search],
  );

  const onExitComplete = useCallback(() => {
    if (!pendingTo.current) return;
    finishTransition(pendingTo.current);
  }, [finishTransition]);

  useEffect(() => {
    if (!pendingTo.current) {
      setIsVisible(true);
      setActivePath(location.pathname);
    }
  }, [location.pathname]);

  const navValue = useMemo<PageTransitionContextValue>(
    () => ({ navigateWithTransition, activePath }),
    [navigateWithTransition, activePath],
  );

  const animationValue = useMemo(
    () => ({ isVisible, onExitComplete }),
    [isVisible, onExitComplete],
  );

  return (
    <PageTransitionContext.Provider value={navValue}>
      <PageTransitionAnimationContext.Provider value={animationValue}>
        {children}
      </PageTransitionAnimationContext.Provider>
    </PageTransitionContext.Provider>
  );
}

export function PageTransitionMain({
  mainRef,
  className,
}: {
  mainRef: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const { pathname } = useLocation();
  const animation = useContext(PageTransitionAnimationContext);
  if (!animation) {
    throw new Error(
      "PageTransitionMain must be used within PageTransitionProvider",
    );
  }

  const { isVisible, onExitComplete } = animation;

  useLayoutEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname, mainRef]);

  return (
    <main ref={mainRef} className={className}>
      <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
        {isVisible ? (
          <motion.div
            key={pathname}
            className="w-full min-w-0"
            {...PAGE_MAIN_MOTION}
          >
            <Outlet />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
