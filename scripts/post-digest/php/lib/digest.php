<?php

declare(strict_types=1);

require_once __DIR__ . '/supabase.php';

/**
 * Section matrix — keep in sync with
 * src/shared/constants/postDigestEmail.ts (POST_DIGEST_SECTIONS_BY_ROLE).
 *
 * @return array<string, list<string>>
 */
function postDigestSectionsByRole(): array
{
    return [
        'executive' => ['today_to_be_posted_on_team'],
        'manager' => ['today_to_be_posted_managed', 'yesterday_not_posted_managed'],
        'admin' => ['yesterday_not_posted_all'],
    ];
}

/** @return array<string, string> */
function postDigestSectionLabels(): array
{
    return [
        'today_to_be_posted_on_team' => "Today's postings (your projects)",
        'today_to_be_posted_managed' => "Today's postings (projects you manage)",
        'yesterday_not_posted_managed' => "Yesterday's not posted (projects you manage)",
        'yesterday_not_posted_all' => "Yesterday's not posted (all projects)",
    ];
}

/**
 * @return list<array{id: string, title: string, posts: list<array<string, mixed>>}>
 */
function buildDigestSectionsForMember(
    array $config,
    array $member,
    string $today,
    string $yesterday,
): array {
    $role = (string) ($member['role'] ?? '');
    $memberId = (string) ($member['id'] ?? '');
    $sectionsByRole = postDigestSectionsByRole();
    $labels = postDigestSectionLabels();
    $sectionIds = $sectionsByRole[$role] ?? [];

    if ($memberId === '' || $sectionIds === []) {
        return [];
    }

    $built = [];

    foreach ($sectionIds as $sectionId) {
        $posts = match ($sectionId) {
            'today_to_be_posted_on_team' => fetchPostsForDigest(
                $config,
                $today,
                fetchOnTeamProjectIds($config, $memberId),
            ),
            'today_to_be_posted_managed' => fetchPostsForDigest(
                $config,
                $today,
                fetchManagedProjectIds($config, $memberId),
            ),
            'yesterday_not_posted_managed' => fetchPostsForDigest(
                $config,
                $yesterday,
                fetchManagedProjectIds($config, $memberId),
                'Not posted',
            ),
            'yesterday_not_posted_all' => fetchPostsForDigest(
                $config,
                $yesterday,
                null,
                'Not posted',
            ),
            default => [],
        };

        if ($posts === []) {
            continue;
        }

        $built[] = [
            'id' => $sectionId,
            'title' => $labels[$sectionId] ?? $sectionId,
            'posts' => $posts,
        ];
    }

    return $built;
}

/**
 * @param list<array{id: string, title: string, posts: list<array<string, mixed>>}> $sections
 */
function buildDigestHtml(
    string $memberName,
    string $today,
    array $sections,
    string $portalPostsUrl,
): string {
    $escape = static fn (string $value): string => htmlspecialchars(
        $value,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8',
    );

    $html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#111;line-height:1.5">';
    $html .= '<p>Hi ' . $escape($memberName) . ',</p>';
    $html .= '<p>Here is your Digi Carotene post digest for <strong>'
        . $escape($today)
        . '</strong>.</p>';

    foreach ($sections as $section) {
        $html .= '<h2 style="font-size:16px;margin:24px 0 8px">'
            . $escape((string) $section['title'])
            . '</h2>';
        $html .= '<ol style="padding-left:20px;margin:0">';

        foreach ($section['posts'] as $post) {
            $projects = is_array($post['projects'] ?? null) ? $post['projects'] : [];
            $clients = is_array($projects['clients'] ?? null) ? $projects['clients'] : [];
            $clientName = is_string($clients['client_name'] ?? null) ? $clients['client_name'] : '—';
            $projectName = is_string($projects['project_name'] ?? null) ? $projects['project_name'] : '—';
            $title = is_string($post['post_title'] ?? null) && $post['post_title'] !== ''
                ? $post['post_title']
                : '(Untitled post)';
            $time = is_string($post['to_be_posted_time'] ?? null) ? $post['to_be_posted_time'] : '';
            $status = is_string($post['status'] ?? null) ? $post['status'] : '';
            $date = is_string($post['to_be_posted_date'] ?? null) ? $post['to_be_posted_date'] : '';

            $line = $clientName . ' · ' . $projectName . ' — ' . $title;
            if ($date !== '') {
                $line .= ' · ' . $date;
            }
            if ($time !== '') {
                $line .= ' ' . $time;
            }
            if ($status !== '') {
                $line .= ' · ' . $status;
            }

            $html .= '<li style="margin:0 0 8px">' . $escape($line) . '</li>';
        }

        $html .= '</ol>';
    }

    if ($portalPostsUrl !== '') {
        $html .= '<p style="margin-top:24px"><a href="'
            . $escape($portalPostsUrl)
            . '">Open Posts Management</a></p>';
    }

    $html .= '<p style="margin-top:24px;color:#666;font-size:12px">Sent automatically by Digi Carotene.</p>';
    $html .= '</div>';

    return $html;
}
