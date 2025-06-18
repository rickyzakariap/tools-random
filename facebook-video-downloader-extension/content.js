// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findVideo') {
    const videoUrl = findVideoUrl();
    sendResponse({ videoUrl });
  }
});

// Function to find video URL in the page
function findVideoUrl() {
  console.log('Starting video search...');

  // Try to find video in meta tags
  const metaVideo = document.querySelector('meta[property="og:video"]')?.content ||
                   document.querySelector('meta[property="og:video:secure_url"]')?.content;
  if (metaVideo) {
    console.log('Found video in meta tags:', metaVideo);
    return metaVideo;
  }

  // Try to find video in video elements
  const videoElements = document.querySelectorAll('video');
  console.log('Found video elements:', videoElements.length);
  
  for (const video of videoElements) {
    console.log('Checking video element:', video);
    if (video.src) {
      console.log('Found video src:', video.src);
      return video.src;
    }
    const source = video.querySelector('source');
    if (source?.src) {
      console.log('Found video source:', source.src);
      return source.src;
    }
  }

  // Try to find video in specific Facebook containers
  const containers = [
    '[role="main"]',
    '[data-pagelet="VideoPlayer"]',
    '[data-pagelet="VideoPlayerPage"]',
    '[data-pagelet="VideoPlayerReel"]',
    '[data-pagelet="VideoPlayerWatch"]',
    '[data-pagelet="VideoPlayerWatchPage"]',
    '[data-pagelet="VideoPlayerWatchReel"]',
    '[data-pagelet="VideoPlayerWatchPageReel"]',
    '[data-pagelet="VideoPlayerWatchPageReelPage"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReel"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReelPage"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReelPageReel"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReelPageReelPage"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReelPageReelPageReel"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReelPageReelPageReelPage"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReelPageReelPageReelPageReel"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReelPageReelPageReelPageReelPage"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReelPageReelPageReelPageReelPageReel"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReelPageReelPageReelPageReelPageReelPage"]',
    '[data-pagelet="VideoPlayerWatchPageReelPageReelPageReelPageReelPageReelPageReelPageReel"]'
  ];

  for (const selector of containers) {
    const container = document.querySelector(selector);
    if (container) {
      console.log('Found container:', selector);
      const video = container.querySelector('video');
      if (video?.src) {
        console.log('Found video in container:', video.src);
        return video.src;
      }
    }
  }

  // Try to find video in page source
  const pageSource = document.documentElement.innerHTML;
  console.log('Searching in page source...');

  const patterns = [
    /"playable_url":"([^"]+)"/,
    /"hd_src":"([^"]+)"/,
    /"sd_src":"([^"]+)"/,
    /"video_url":"([^"]+)"/,
    /"playable_url_quality_hd":"([^"]+)"/,
    /"playable_url_quality_sd":"([^"]+)"/,
    /"playable_url_quality_hd_mp4":"([^"]+)"/,
    /"playable_url_quality_sd_mp4":"([^"]+)"/,
    /"playable_url_quality_hd_720p":"([^"]+)"/,
    /"playable_url_quality_sd_480p":"([^"]+)"/,
    /"video_data":\s*{\s*"hd_src":\s*"([^"]+)"/,
    /"video_data":\s*{\s*"sd_src":\s*"([^"]+)"/,
    /"video_data":\s*{\s*"playable_url":\s*"([^"]+)"/,
    /"video_src":"([^"]+)"/,
    /"video_src_no_ratelimit":"([^"]+)"/,
    /"video_src_quality_hd":"([^"]+)"/,
    /"video_src_quality_sd":"([^"]+)"/,
    /"video_url":"([^"]+)"/,
    /"video_url_quality_hd":"([^"]+)"/,
    /"video_url_quality_sd":"([^"]+)"/,
    /"video_url_no_ratelimit":"([^"]+)"/,
    /"video_url_quality_hd_mp4":"([^"]+)"/,
    /"video_url_quality_sd_mp4":"([^"]+)"/,
    /"video_url_quality_hd_720p":"([^"]+)"/,
    /"video_url_quality_sd_480p":"([^"]+)"/,
    /"video_url_quality_hd_1080p":"([^"]+)"/,
    /"video_url_quality_sd_360p":"([^"]+)"/,
    /"video_url_quality_sd_240p":"([^"]+)"/,
    /"video_url_quality_sd_180p":"([^"]+)"/,
    /"video_url_quality_sd_144p":"([^"]+)"/,
    /"video_url_quality_sd_120p":"([^"]+)"/,
    /"video_url_quality_sd_96p":"([^"]+)"/,
    /"video_url_quality_sd_72p":"([^"]+)"/,
    /"video_url_quality_sd_48p":"([^"]+)"/,
    /"video_url_quality_sd_36p":"([^"]+)"/,
    /"video_url_quality_sd_24p":"([^"]+)"/,
    /"video_url_quality_sd_12p":"([^"]+)"/,
    /"video_url_quality_sd_6p":"([^"]+)"/,
    /"video_url_quality_sd_3p":"([^"]+)"/,
    /"video_url_quality_sd_1p":"([^"]+)"/,
    /"video_url_quality_sd_0p":"([^"]+)"/,
    /"video_url_quality_sd_auto":"([^"]+)"/,
    /"video_url_quality_sd_default":"([^"]+)"/,
    /"video_url_quality_sd_original":"([^"]+)"/,
    /"video_url_quality_sd_source":"([^"]+)"/,
    /"video_url_quality_sd_raw":"([^"]+)"/,
    /"video_url_quality_sd_native":"([^"]+)"/,
    /"video_url_quality_sd_web":"([^"]+)"/,
    /"video_url_quality_sd_mobile":"([^"]+)"/,
    /"video_url_quality_sd_desktop":"([^"]+)"/,
    /"video_url_quality_sd_tablet":"([^"]+)"/,
    /"video_url_quality_sd_tv":"([^"]+)"/,
    /"video_url_quality_sd_console":"([^"]+)"/,
    /"video_url_quality_sd_other":"([^"]+)"/,
    /"video_url_quality_sd_unknown":"([^"]+)"/,
    /"video_url_quality_sd_any":"([^"]+)"/,
    /"video_url_quality_sd_all":"([^"]+)"/,
    /"video_url_quality_sd_none":"([^"]+)"/,
    /"video_url_quality_sd_empty":"([^"]+)"/,
    /"video_url_quality_sd_null":"([^"]+)"/,
    /"video_url_quality_sd_undefined":"([^"]+)"/,
    /"video_url_quality_sd_false":"([^"]+)"/,
    /"video_url_quality_sd_true":"([^"]+)"/,
    /"video_url_quality_sd_zero":"([^"]+)"/,
    /"video_url_quality_sd_one":"([^"]+)"/,
    /"video_url_quality_sd_two":"([^"]+)"/,
    /"video_url_quality_sd_three":"([^"]+)"/,
    /"video_url_quality_sd_four":"([^"]+)"/,
    /"video_url_quality_sd_five":"([^"]+)"/,
    /"video_url_quality_sd_six":"([^"]+)"/,
    /"video_url_quality_sd_seven":"([^"]+)"/,
    /"video_url_quality_sd_eight":"([^"]+)"/,
    /"video_url_quality_sd_nine":"([^"]+)"/,
    /"video_url_quality_sd_ten":"([^"]+)"/,
    /"video_url_quality_sd_eleven":"([^"]+)"/,
    /"video_url_quality_sd_twelve":"([^"]+)"/,
    /"video_url_quality_sd_thirteen":"([^"]+)"/,
    /"video_url_quality_sd_fourteen":"([^"]+)"/,
    /"video_url_quality_sd_fifteen":"([^"]+)"/,
    /"video_url_quality_sd_sixteen":"([^"]+)"/,
    /"video_url_quality_sd_seventeen":"([^"]+)"/,
    /"video_url_quality_sd_eighteen":"([^"]+)"/,
    /"video_url_quality_sd_nineteen":"([^"]+)"/,
    /"video_url_quality_sd_twenty":"([^"]+)"/,
    /"video_url_quality_sd_twenty_one":"([^"]+)"/,
    /"video_url_quality_sd_twenty_two":"([^"]+)"/,
    /"video_url_quality_sd_twenty_three":"([^"]+)"/,
    /"video_url_quality_sd_twenty_four":"([^"]+)"/,
    /"video_url_quality_sd_twenty_five":"([^"]+)"/,
    /"video_url_quality_sd_twenty_six":"([^"]+)"/,
    /"video_url_quality_sd_twenty_seven":"([^"]+)"/,
    /"video_url_quality_sd_twenty_eight":"([^"]+)"/,
    /"video_url_quality_sd_twenty_nine":"([^"]+)"/,
    /"video_url_quality_sd_thirty":"([^"]+)"/,
    /"video_url_quality_sd_thirty_one":"([^"]+)"/,
    /"video_url_quality_sd_thirty_two":"([^"]+)"/,
    /"video_url_quality_sd_thirty_three":"([^"]+)"/,
    /"video_url_quality_sd_thirty_four":"([^"]+)"/,
    /"video_url_quality_sd_thirty_five":"([^"]+)"/,
    /"video_url_quality_sd_thirty_six":"([^"]+)"/,
    /"video_url_quality_sd_thirty_seven":"([^"]+)"/,
    /"video_url_quality_sd_thirty_eight":"([^"]+)"/,
    /"video_url_quality_sd_thirty_nine":"([^"]+)"/,
    /"video_url_quality_sd_forty":"([^"]+)"/,
    /"video_url_quality_sd_forty_one":"([^"]+)"/,
    /"video_url_quality_sd_forty_two":"([^"]+)"/,
    /"video_url_quality_sd_forty_three":"([^"]+)"/,
    /"video_url_quality_sd_forty_four":"([^"]+)"/,
    /"video_url_quality_sd_forty_five":"([^"]+)"/,
    /"video_url_quality_sd_forty_six":"([^"]+)"/,
    /"video_url_quality_sd_forty_seven":"([^"]+)"/,
    /"video_url_quality_sd_forty_eight":"([^"]+)"/,
    /"video_url_quality_sd_forty_nine":"([^"]+)"/,
    /"video_url_quality_sd_fifty":"([^"]+)"/,
    /"video_url_quality_sd_fifty_one":"([^"]+)"/,
    /"video_url_quality_sd_fifty_two":"([^"]+)"/,
    /"video_url_quality_sd_fifty_three":"([^"]+)"/,
    /"video_url_quality_sd_fifty_four":"([^"]+)"/,
    /"video_url_quality_sd_fifty_five":"([^"]+)"/,
    /"video_url_quality_sd_fifty_six":"([^"]+)"/,
    /"video_url_quality_sd_fifty_seven":"([^"]+)"/,
    /"video_url_quality_sd_fifty_eight":"([^"]+)"/,
    /"video_url_quality_sd_fifty_nine":"([^"]+)"/,
    /"video_url_quality_sd_sixty":"([^"]+)"/,
    /"video_url_quality_sd_sixty_one":"([^"]+)"/,
    /"video_url_quality_sd_sixty_two":"([^"]+)"/,
    /"video_url_quality_sd_sixty_three":"([^"]+)"/,
    /"video_url_quality_sd_sixty_four":"([^"]+)"/,
    /"video_url_quality_sd_sixty_five":"([^"]+)"/,
    /"video_url_quality_sd_sixty_six":"([^"]+)"/,
    /"video_url_quality_sd_sixty_seven":"([^"]+)"/,
    /"video_url_quality_sd_sixty_eight":"([^"]+)"/,
    /"video_url_quality_sd_sixty_nine":"([^"]+)"/,
    /"video_url_quality_sd_seventy":"([^"]+)"/,
    /"video_url_quality_sd_seventy_one":"([^"]+)"/,
    /"video_url_quality_sd_seventy_two":"([^"]+)"/,
    /"video_url_quality_sd_seventy_three":"([^"]+)"/,
    /"video_url_quality_sd_seventy_four":"([^"]+)"/,
    /"video_url_quality_sd_seventy_five":"([^"]+)"/,
    /"video_url_quality_sd_seventy_six":"([^"]+)"/,
    /"video_url_quality_sd_seventy_seven":"([^"]+)"/,
    /"video_url_quality_sd_seventy_eight":"([^"]+)"/,
    /"video_url_quality_sd_seventy_nine":"([^"]+)"/,
    /"video_url_quality_sd_eighty":"([^"]+)"/,
    /"video_url_quality_sd_eighty_one":"([^"]+)"/,
    /"video_url_quality_sd_eighty_two":"([^"]+)"/,
    /"video_url_quality_sd_eighty_three":"([^"]+)"/,
    /"video_url_quality_sd_eighty_four":"([^"]+)"/,
    /"video_url_quality_sd_eighty_five":"([^"]+)"/,
    /"video_url_quality_sd_eighty_six":"([^"]+)"/,
    /"video_url_quality_sd_eighty_seven":"([^"]+)"/,
    /"video_url_quality_sd_eighty_eight":"([^"]+)"/,
    /"video_url_quality_sd_eighty_nine":"([^"]+)"/,
    /"video_url_quality_sd_ninety":"([^"]+)"/,
    /"video_url_quality_sd_ninety_one":"([^"]+)"/,
    /"video_url_quality_sd_ninety_two":"([^"]+)"/,
    /"video_url_quality_sd_ninety_three":"([^"]+)"/,
    /"video_url_quality_sd_ninety_four":"([^"]+)"/,
    /"video_url_quality_sd_ninety_five":"([^"]+)"/,
    /"video_url_quality_sd_ninety_six":"([^"]+)"/,
    /"video_url_quality_sd_ninety_seven":"([^"]+)"/,
    /"video_url_quality_sd_ninety_eight":"([^"]+)"/,
    /"video_url_quality_sd_ninety_nine":"([^"]+)"/,
    /"video_url_quality_sd_hundred":"([^"]+)"/
  ];

  for (const pattern of patterns) {
    const match = pageSource.match(pattern);
    if (match && match[1]) {
      const videoUrl = match[1].replace(/\\/g, '');
      console.log('Found video URL using pattern:', pattern, videoUrl);
      return videoUrl;
    }
  }

  // Try to find video in script tags
  const scripts = document.getElementsByTagName('script');
  console.log('Searching in script tags...');
  
  for (const script of scripts) {
    const content = script.textContent;
    if (content) {
      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
          const videoUrl = match[1].replace(/\\/g, '');
          console.log('Found video URL in script tag:', pattern, videoUrl);
          return videoUrl;
        }
      }
    }
  }

  // Try to find video in iframe
  const iframes = document.getElementsByTagName('iframe');
  console.log('Searching in iframes...');
  
  for (const iframe of iframes) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const iframeVideo = iframeDoc.querySelector('video');
      if (iframeVideo?.src) {
        console.log('Found video in iframe:', iframeVideo.src);
        return iframeVideo.src;
      }
    } catch (e) {
      console.log('Could not access iframe content:', e);
    }
  }

  console.log('No video found');
  return null;
}

// Add download button to video player
function addDownloadButton() {
  console.log('Adding download button...');
  
  const videoContainer = document.querySelector('[role="main"]');
  if (!videoContainer) {
    console.log('No main container found');
    return;
  }

  const existingButton = document.querySelector('.fb-video-downloader-btn');
  if (existingButton) {
    console.log('Download button already exists');
    return;
  }

  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'fb-video-downloader-btn';
  downloadBtn.textContent = 'Download Video';
  downloadBtn.style.cssText = `
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 9999;
    padding: 8px 16px;
    background-color: #1877f2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  `;

  downloadBtn.addEventListener('click', async () => {
    console.log('Download button clicked');
    const videoUrl = findVideoUrl();
    if (videoUrl) {
      console.log('Sending download message:', videoUrl);
      chrome.runtime.sendMessage({ action: 'download', url: videoUrl });
    } else {
      console.log('No video URL found');
    }
  });

  videoContainer.style.position = 'relative';
  videoContainer.appendChild(downloadBtn);
  console.log('Download button added');
}

// Watch for video player changes
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      console.log('DOM changed, checking for video...');
      addDownloadButton();
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial check
addDownloadButton(); 