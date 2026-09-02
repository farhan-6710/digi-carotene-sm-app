<?php

declare(strict_types=1);

require_once __DIR__ . '/supabase.php';

/** Keep in sync with src/shared/constants/taskDigestEmail.ts */
const TASK_DIGEST_EMAIL_TOP_COUNT = 3;

/** @return list<string> */
function fetchAssignedTaskIdsForMember(array $config, string $memberId): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'task_assignees?select=task_id&team_member_id=eq.' . rawurlencode($memberId),
    );

    return idsFromRows(is_array($rows) ? $rows : [], 'task_id');
}

/** @return list<string> */
function fetchTaggedTaskIdsForMember(array $config, string $memberId): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'task_tags?select=task_id&team_member_id=eq.' . rawurlencode($memberId),
    );

    return idsFromRows(is_array($rows) ? $rows : [], 'task_id');
}

/** @return list<string> */
function fetchAssignedSubtaskIdsForMember(array $config, string $memberId): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'subtask_assignees?select=subtask_id&team_member_id=eq.' . rawurlencode($memberId),
    );

    return idsFromRows(is_array($rows) ? $rows : [], 'subtask_id');
}

/**
 * @param list<string> $ids
 * @return list<array<string, mixed>>
 */
function fetchHighPriorityOpenTasksByIds(array $config, array $ids): array
{
    if ($ids === []) {
        return [];
    }

    $query = 'tasks?select=id,title,priority,eta_date,eta_time,status,'
        . 'projects:sm_projects(project_name),dev_projects(project_name)'
        . '&id=in.(' . implode(',', array_map('rawurlencode', $ids)) . ')'
        . '&priority=eq.high'
        . '&status=in.(pending,in_progress)';

    $rows = supabaseRequest($config, 'GET', $query);

    return is_array($rows) ? $rows : [];
}

/**
 * @param list<string> $ids
 * @return list<array<string, mixed>>
 */
function fetchHighPriorityOpenSubtasksByIds(array $config, array $ids): array
{
    if ($ids === []) {
        return [];
    }

    $query = 'subtasks?select=id,parent_task_id,title,priority,eta_date,eta_time,status'
        . '&id=in.(' . implode(',', array_map('rawurlencode', $ids)) . ')'
        . '&priority=eq.high'
        . '&status=in.(pending,in_progress)';

    $rows = supabaseRequest($config, 'GET', $query);

    return is_array($rows) ? $rows : [];
}

/** @return list<array{kind: string, label: string, meta: string, priority_rank: int, eta_date: string, eta_time: string}> */
function buildTaskDigestItemsForMember(array $config, string $memberId): array
{
    $taskIds = array_values(array_unique(array_merge(
        fetchAssignedTaskIdsForMember($config, $memberId),
        fetchTaggedTaskIdsForMember($config, $memberId),
    )));
    $subtaskIds = fetchAssignedSubtaskIdsForMember($config, $memberId);

    $items = [];

    foreach (fetchHighPriorityOpenTasksByIds($config, $taskIds) as $task) {
        $items[] = [
            'kind' => 'task',
            'label' => formatTaskDigestTaskLabel($task),
            'meta' => formatTaskDigestMeta($task),
            'priority_rank' => priorityRank(is_string($task['priority'] ?? null) ? $task['priority'] : ''),
            'eta_date' => is_string($task['eta_date'] ?? null) ? $task['eta_date'] : '',
            'eta_time' => is_string($task['eta_time'] ?? null) ? $task['eta_time'] : '',
        ];
    }

    foreach (fetchHighPriorityOpenSubtasksByIds($config, $subtaskIds) as $subtask) {
        $title = is_string($subtask['title'] ?? null) ? $subtask['title'] : '(Untitled subtask)';
        $items[] = [
            'kind' => 'subtask',
            'label' => 'Subtask · ' . $title,
            'meta' => formatTaskDigestMeta($subtask),
            'priority_rank' => priorityRank(is_string($subtask['priority'] ?? null) ? $subtask['priority'] : ''),
            'eta_date' => is_string($subtask['eta_date'] ?? null) ? $subtask['eta_date'] : '',
            'eta_time' => is_string($subtask['eta_time'] ?? null) ? $subtask['eta_time'] : '',
        ];
    }

    usort($items, static function (array $a, array $b): int {
        if ($a['priority_rank'] !== $b['priority_rank']) {
            return $b['priority_rank'] <=> $a['priority_rank'];
        }

        $byDate = strcmp($a['eta_date'], $b['eta_date']);
        if ($byDate !== 0) {
            return $byDate;
        }

        return strcmp($a['eta_time'], $b['eta_time']);
    });

    return $items;
}

function priorityRank(string $priority): int
{
    return match ($priority) {
        'high' => 2,
        'medium' => 1,
        default => 0,
    };
}

/** @param array<string, mixed> $task */
function formatTaskDigestTaskLabel(array $task): string
{
    $title = is_string($task['title'] ?? null) && $task['title'] !== ''
        ? $task['title']
        : '(Untitled task)';

    $projects = is_array($task['projects'] ?? null) ? $task['projects'] : null;
    $devProjects = is_array($task['dev_projects'] ?? null) ? $task['dev_projects'] : null;
    $projectName = 'Task';

    if (is_array($projects) && is_string($projects['project_name'] ?? null) && $projects['project_name'] !== '') {
        $projectName = $projects['project_name'];
    } elseif (is_array($devProjects) && is_string($devProjects['project_name'] ?? null) && $devProjects['project_name'] !== '') {
        $projectName = $devProjects['project_name'];
    }

    return $projectName . ' · ' . $title;
}

/** @param array<string, mixed> $row */
function formatTaskDigestMeta(array $row): string
{
    $status = is_string($row['status'] ?? null) ? $row['status'] : '';
    $etaDate = is_string($row['eta_date'] ?? null) ? $row['eta_date'] : '';
    $etaTime = is_string($row['eta_time'] ?? null) ? $row['eta_time'] : '';

    $parts = array_filter([$status !== '' ? ucwords(str_replace('_', ' ', $status)) : null, $etaDate, $etaTime]);

    return implode(' · ', $parts);
}

/**
 * @param list<array{kind: string, label: string, meta: string}> $items
 */
function buildTaskDigestHtml(
    string $memberName,
    string $today,
    array $items,
    string $portalTasksUrl,
): string {
    $escape = static fn (string $value): string => htmlspecialchars(
        $value,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8',
    );

    $topItems = array_slice($items, 0, TASK_DIGEST_EMAIL_TOP_COUNT);
    $totalCount = count($items);

    $html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#111;line-height:1.5">';
    $html .= '<p>Hi ' . $escape($memberName) . ',</p>';
    $html .= '<p>You have <strong>' . $totalCount . '</strong> high-priority open '
        . ($totalCount === 1 ? 'task or subtask' : 'tasks/subtasks')
        . ' assigned to you or listed as a dependency.</p>';
    $html .= '<h2 style="font-size:16px;margin:24px 0 8px">Top priorities</h2>';
    $html .= '<ol style="padding-left:20px;margin:0">';

    foreach ($topItems as $item) {
        $kindLabel = $item['kind'] === 'subtask' ? 'Subtask' : 'Task';
        $html .= '<li style="margin:0 0 8px"><strong>' . $escape($kindLabel) . ':</strong> '
            . $escape($item['label'])
            . ' — ' . $escape($item['meta'])
            . '</li>';
    }

    $html .= '</ol>';

    if ($totalCount > TASK_DIGEST_EMAIL_TOP_COUNT) {
        $remaining = $totalCount - TASK_DIGEST_EMAIL_TOP_COUNT;
        $html .= '<p style="margin-top:16px;color:#666">'
            . $remaining . ' more high-priority item' . ($remaining === 1 ? '' : 's')
            . ' waiting in Task Management.</p>';
    }

    if ($portalTasksUrl !== '') {
        $html .= '<p style="margin-top:24px"><a href="'
            . $escape($portalTasksUrl)
            . '">Open Task Management</a></p>';
    }

    $html .= '<p style="margin-top:24px;color:#666;font-size:12px">Sent automatically by Digi Carotene.</p>';
    $html .= '</div>';

    return $html;
}

/** @param list<array<string, mixed>> $rows */
function idsFromRows(array $rows, string $key): array
{
    $ids = [];

    foreach ($rows as $row) {
        $id = is_string($row[$key] ?? null) ? $row[$key] : '';
        if ($id !== '') {
            $ids[] = $id;
        }
    }

    return array_values(array_unique($ids));
}

function createTaskDigestNotification(
    array $config,
    string $memberId,
    string $title,
    string $message,
): void {
    supabaseRequest(
        $config,
        'POST',
        'notifications',
        [
            'recipient_team_member_id' => $memberId,
            'notification_type' => 'task_digest',
            'title' => $title,
            'message' => $message,
            'status' => 'unread',
            'related_id' => null,
        ],
        ['Prefer: return=minimal'],
    );
}
