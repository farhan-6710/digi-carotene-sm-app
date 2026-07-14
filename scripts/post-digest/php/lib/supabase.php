<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function supabaseRequest(
    array $config,
    string $method,
    string $path,
    ?array $body = null,
    array $extraHeaders = [],
): array {
    $url = rtrim($config['supabase_url'], '/') . '/rest/v1/' . ltrim($path, '/');
    $headers = array_merge([
        'apikey: ' . $config['supabase_service_key'],
        'Authorization: Bearer ' . $config['supabase_service_key'],
    ], $extraHeaders);

    return httpJson($method, $url, $body, $headers);
}

/** @return list<array{id: string, member_name: string, email: string, role: string}> */
function fetchTeamMembers(array $config): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'team_members?select=id,member_name,email,role&order=member_name.asc',
    );

    return is_array($rows) ? $rows : [];
}

/** @return list<string> */
function fetchManagedProjectIds(array $config, string $memberId): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'projects?select=id&manager_id=eq.' . rawurlencode($memberId),
    );

    return projectIdsFromRows(is_array($rows) ? $rows : []);
}

/** @return list<string> */
function fetchOnTeamProjectIds(array $config, string $memberId): array
{
    $rows = supabaseRequest(
        $config,
        'GET',
        'project_team_members?select=project_id&member_id=eq.'
            . rawurlencode($memberId)
            . '&ended_at=is.null',
    );

    if (!is_array($rows)) {
        return [];
    }

    $ids = [];
    foreach ($rows as $row) {
        $id = is_string($row['project_id'] ?? null) ? $row['project_id'] : '';
        if ($id !== '') {
            $ids[] = $id;
        }
    }

    return array_values(array_unique($ids));
}

/**
 * Posts for a schedule day, optionally filtered by project ids and/or status.
 *
 * @param list<string>|null $projectIds null = all projects
 * @return list<array<string, mixed>>
 */
function fetchPostsForDigest(
    array $config,
    string $date,
    ?array $projectIds,
    ?string $status = null,
): array {
    if (is_array($projectIds) && $projectIds === []) {
        return [];
    }

    $query = 'posts?select=id,post_title,post_type,status,to_be_posted_date,to_be_posted_time,'
        . 'socials,projects(project_name,clients(client_name))'
        . '&to_be_posted_date=eq.' . rawurlencode($date)
        . '&order=to_be_posted_date.asc,to_be_posted_time.asc';

    if ($status !== null) {
        $query .= '&status=eq.' . rawurlencode($status);
    }

    if (is_array($projectIds)) {
        $query .= '&project_id=in.(' . implode(',', array_map('rawurlencode', $projectIds)) . ')';
    }

    $rows = supabaseRequest($config, 'GET', $query);

    return is_array($rows) ? $rows : [];
}

/** @param list<array{id?: mixed}> $rows @return list<string> */
function projectIdsFromRows(array $rows): array
{
    $ids = [];
    foreach ($rows as $row) {
        $id = is_string($row['id'] ?? null) ? $row['id'] : '';
        if ($id !== '') {
            $ids[] = $id;
        }
    }

    return array_values(array_unique($ids));
}
