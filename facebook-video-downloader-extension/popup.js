document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.getElementById('downloadBtn');
  const statusDiv = document.getElementById('status');

  downloadBtn.addEventListener('click', async () => {
    try {
      downloadBtn.disabled = true;
      statusDiv.textContent = 'Searching for video...';
      statusDiv.className = 'status';

      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Check if we're on Facebook
      if (!tab.url.includes('facebook.com')) {
        throw new Error('Please navigate to a Facebook video page');
      }

      // Execute content script to find video
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: findVideoUrl
      });

      const videoUrl = results[0].result;
      
      if (!videoUrl) {
        throw new Error('No video found on this page');
      }

      // Download the video
      await chrome.downloads.download({
        url: videoUrl,
        filename: `facebook_video_${Date.now()}.mp4`
      });

      statusDiv.textContent = 'Download started!';
      statusDiv.className = 'status success';
    } catch (error) {
      statusDiv.textContent = error.message;
      statusDiv.className = 'status error';
    } finally {
      downloadBtn.disabled = false;
    }
  });
});

// Function to find video URL in the page
function findVideoUrl() {
  // Try to find video in meta tags
  const metaVideo = document.querySelector('meta[property="og:video"]')?.content ||
                   document.querySelector('meta[property="og:video:secure_url"]')?.content;
  if (metaVideo) return metaVideo;

  // Try to find video in video elements
  const videoElement = document.querySelector('video source')?.src;
  if (videoElement) return videoElement;

  // Try to find video in page source
  const pageSource = document.documentElement.innerHTML;
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
    /"video_src_quality_sd":"([^"]+)"/
  ];

  for (const pattern of patterns) {
    const match = pageSource.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/\\/g, '');
    }
  }

  // Try to find video in script tags
  const scripts = document.getElementsByTagName('script');
  for (const script of scripts) {
    const content = script.textContent;
    if (content) {
      for (const pattern of patterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
          return match[1].replace(/\\/g, '');
        }
      }
    }
  }

  return null;
} 