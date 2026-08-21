($current[0].baseline // {}) as $baseline
| ($current[0].githubReleaseStart // {}) as $githubReleaseStart
| ($current[0].counts // {}) as $currentCounts
| {
    baseline: $baseline,
    githubReleaseStart: $githubReleaseStart,
    counts: (
      reduce .[] as $release (
        {};
        .[$release.tag_name] = (
          reduce $release.assets[] as $asset (
            {};
            ($asset.download_count - ($githubReleaseStart[$release.tag_name][$asset.name] // 0)) as $newDownloads
            | (($baseline[$release.tag_name][$asset.name] // 0) + ($newDownloads | if . > 0 then . else 0 end)) as $calculated
            | .[$asset.name] = ([($currentCounts[$release.tag_name][$asset.name] // 0), $calculated] | max)
          )
        )
      )
    )
  }
