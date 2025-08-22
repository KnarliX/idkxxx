# YouTube Video Type Detection in Node.js (Bina API Key)

YouTube videos ka type detect karna Node.js mein bina official API key ke - complete guide Hindi/English mein.

## Video Types

YouTube par 4 main video types hote hain:

1. **Normal Video** - Regular uploaded video
2. **Live Stream** - Currently live broadcasting
3. **Premiere** - Scheduled premiere (upcoming ya ongoing)
4. **Upcoming Live** - Scheduled live stream

## Method 1: ytdl-core Library (Sabse Best)

### Installation
```bash
npm install ytdl-core
```

### Basic Usage
```javascript
const ytdl = require('ytdl-core');

async function getVideoInfo(videoId) {
    try {
        const info = await ytdl.getBasicInfo(`https://www.youtube.com/watch?v=${videoId}`);
        
        const videoDetails = info.videoDetails;
        const microformat = info.player_response?.microformat?.playerMicroformatRenderer;
        
        // Video type determine karna
        let videoType = 'normal';
        let scheduledTime = null;
        
        if (videoDetails.isLiveContent) {
            const liveBroadcastContent = microformat?.liveBroadcastContent || 'none';
            
            if (liveBroadcastContent === 'upcoming') {
                videoType = 'upcoming_live';
                scheduledTime = microformat?.liveBroadcastDetails?.startTimestamp;
            } else if (liveBroadcastContent === 'live') {
                videoType = 'live';
            } else {
                videoType = 'live_ended';
            }
        }
        
        // Premiere detect karna
        if (microformat?.liveBroadcastContent === 'upcoming' && videoDetails.lengthSeconds) {
            videoType = 'upcoming_premiere';
            scheduledTime = microformat?.publishDate;
        }
        
        return {
            videoType,
            title: videoDetails.title,
            author: videoDetails.author.name,
            duration: videoDetails.lengthSeconds,
            scheduledTime,
            publishDate: microformat?.publishDate,
            liveBroadcastContent: microformat?.liveBroadcastContent
        };
        
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

// Usage example
getVideoInfo('dQw4w9WgXcQ').then(result => {
    console.log('Video Info:', result);
    
    // Hindi output
    switch(result.videoType) {
        case 'normal':
            console.log('à¤¯à¤¹ à¤à¤• à¤¸à¤¾à¤®à¤¾à¤¨à¥à¤¯ à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤¹à¥ˆ');
            break;
        case 'live':
            console.log('à¤¯à¤¹ à¤…à¤­à¥€ à¤²à¤¾à¤‡à¤µ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ');
            break;
        case 'upcoming_live':
            console.log(`à¤¯à¤¹ ${result.scheduledTime} à¤ªà¤° à¤²à¤¾à¤‡à¤µ à¤¹à¥‹à¤—à¤¾`);
            break;
        case 'upcoming_premiere':
            console.log(`à¤¯à¤¹ ${result.scheduledTime} à¤ªà¤° à¤ªà¥à¤°à¥€à¤®à¤¿à¤¯à¤° à¤¹à¥‹à¤—à¤¾`);
            break;
    }
});
```

## Method 2: YouTube Search API (Alternative)

### Installation
```bash
npm install youtube-search-api
```

### Usage
```javascript
const youtubesearchapi = require("youtube-search-api");

async function getVideoDetailsWithType(videoId) {
    try {
        const videoDetails = await youtubesearchapi.GetVideoDetails(videoId);
        
        let videoType = 'normal';
        
        if (videoDetails.isLive === true) {
            videoType = 'live';
        } else if (videoDetails.description?.toLowerCase().includes('premiere')) {
            videoType = 'premiere_ended';
        }
        
        return {
            videoType,
            title: videoDetails.title,
            channel: videoDetails.channel,
            isLive: videoDetails.isLive
        };
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
```

## Method 3: Web Scraping (Advanced)

### Installation
```bash
npm install puppeteer cheerio
```

### Usage
```javascript
const puppeteer = require('puppeteer');

async function scrapeVideoInfo(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const result = await page.evaluate(() => {
        // Live indicators check karna
        const isLive = document.querySelector('span:contains("LIVE")') !== null;
        const isPremiere = document.querySelector('span:contains("PREMIERE")') !== null;
        const isUpcoming = document.querySelector('span:contains("Waiting")') !== null;
        
        // Title extract karna
        const title = document.querySelector('h1.title yt-formatted-string')?.textContent?.trim();
        
        return {
            title,
            isLive,
            isPremiere,
            isUpcoming
        };
    });
    
    await browser.close();
    
    let videoType = 'normal';
    if (result.isLive) {
        videoType = 'live';
    } else if (result.isPremiere) {
        videoType = result.isUpcoming ? 'upcoming_premiere' : 'premiere_ended';
    } else if (result.isUpcoming) {
        videoType = 'upcoming_live';
    }
    
    return { ...result, videoType };
}
```

## Complete Solution (Recommended)

```javascript
const ytdl = require('ytdl-core');

class YouTubeVideoAnalyzer {
    
    async analyzeVideo(videoId) {
        try {
            const url = `https://www.youtube.com/watch?v=${videoId}`;
            const info = await ytdl.getBasicInfo(url);
            
            const videoDetails = info.videoDetails;
            const microformat = info.player_response?.microformat?.playerMicroformatRenderer;
            
            const result = {
                videoId,
                title: videoDetails.title,
                author: videoDetails.author.name,
                duration: videoDetails.lengthSeconds,
                viewCount: videoDetails.viewCount,
                uploadDate: microformat?.uploadDate,
                publishDate: microformat?.publishDate,
                category: microformat?.category,
                isLiveContent: videoDetails.isLiveContent,
                liveBroadcastContent: microformat?.liveBroadcastContent || 'none'
            };
            
            // Video type determine karna
            result.videoType = this.determineVideoType(result);
            result.scheduledTime = this.extractScheduledTime(microformat);
            result.humanReadable = this.getHindiDescription(result);
            
            return result;
            
        } catch (error) {
            throw new Error(`Video analyze nahi kar sake: ${error.message}`);
        }
    }
    
    determineVideoType(info) {
        if (info.isLiveContent) {
            switch(info.liveBroadcastContent) {
                case 'upcoming':
                    return info.duration ? 'upcoming_premiere' : 'upcoming_live';
                case 'live':
                    return info.duration ? 'premiere' : 'live';
                default:
                    return 'live_ended';
            }
        }
        return 'normal';
    }
    
    extractScheduledTime(microformat) {
        if (microformat?.liveBroadcastDetails?.startTimestamp) {
            return new Date(microformat.liveBroadcastDetails.startTimestamp);
        }
        if (microformat?.publishDate && microformat?.liveBroadcastContent === 'upcoming') {
            return new Date(microformat.publishDate);
        }
        return null;
    }
    
    getHindiDescription(info) {
        const type = info.videoType;
        const time = info.scheduledTime;
        
        switch(type) {
            case 'normal':
                return 'à¤¯à¤¹ à¤à¤• à¤¸à¤¾à¤®à¤¾à¤¨à¥à¤¯ à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤¹à¥ˆ';
            case 'live':
                return 'à¤¯à¤¹ à¤…à¤­à¥€ à¤²à¤¾à¤‡à¤µ à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ';
            case 'upcoming_live':
                return time ? `à¤¯à¤¹ ${time.toLocaleString('hi-IN')} à¤ªà¤° à¤²à¤¾à¤‡à¤µ à¤¹à¥‹à¤—à¤¾` : 'à¤¯à¤¹ à¤œà¤²à¥à¤¦ à¤¹à¥€ à¤²à¤¾à¤‡à¤µ à¤¹à¥‹à¤—à¤¾';
            case 'premiere':
                return 'à¤¯à¤¹ à¤…à¤­à¥€ à¤ªà¥à¤°à¥€à¤®à¤¿à¤¯à¤° à¤¹à¥‹ à¤°à¤¹à¤¾ à¤¹à¥ˆ';
            case 'upcoming_premiere':
                return time ? `à¤¯à¤¹ ${time.toLocaleString('hi-IN')} à¤ªà¤° à¤ªà¥à¤°à¥€à¤®à¤¿à¤¯à¤° à¤¹à¥‹à¤—à¤¾` : 'à¤¯à¤¹ à¤œà¤²à¥à¤¦ à¤¹à¥€ à¤ªà¥à¤°à¥€à¤®à¤¿à¤¯à¤° à¤¹à¥‹à¤—à¤¾';
            case 'live_ended':
                return 'à¤¯à¤¹ à¤²à¤¾à¤‡à¤µ à¤¸à¤®à¤¾à¤ªà¥à¤¤ à¤¹à¥‹ à¤—à¤¯à¤¾ à¤¹à¥ˆ';
            default:
                return 'à¤µà¥€à¤¡à¤¿à¤¯à¥‹ à¤•à¤¾ à¤ªà¥à¤°à¤•à¤¾à¤° à¤¨à¤¿à¤°à¥à¤§à¤¾à¤°à¤¿à¤¤ à¤¨à¤¹à¥€à¤‚ à¤•à¤° à¤¸à¤•à¥‡';
        }
    }
}

// Usage
const analyzer = new YouTubeVideoAnalyzer();

// Examples
async function testVideos() {
    const testVideoIds = [
        'dQw4w9WgXcQ', // Normal video
        // Add your test video IDs here
    ];
    
    for (const videoId of testVideoIds) {
        try {
            const result = await analyzer.analyzeVideo(videoId);
            
            console.log(`\n=== Video: ${result.title} ===`);
            console.log(`Type: ${result.videoType}`);
            console.log(`Description: ${result.humanReadable}`);
            console.log(`Author: ${result.author}`);
            console.log(`Duration: ${result.duration} seconds`);
            
            if (result.scheduledTime) {
                console.log(`Scheduled: ${result.scheduledTime}`);
            }
            
        } catch (error) {
            console.error(`Error with video ${videoId}:`, error.message);
        }
    }
}

testVideos();
```

## Error Handling

```javascript
async function safeGetVideoInfo(videoId) {
    try {
        return await analyzer.analyzeVideo(videoId);
    } catch (error) {
        if (error.message.includes('Video unavailable')) {
            return { error: 'Video unavailable hai' };
        } else if (error.message.includes('private')) {
            return { error: 'Video private hai' };
        } else {
            return { error: 'Koi technical error hai' };
        }
    }
}
```

## Important Notes

1. **Rate Limiting**: Zyada request mat bhejiye, YouTube block kar sakta hai
2. **Error Handling**: Hamesha try-catch use karo
3. **Video IDs**: URL se video ID extract karna padega
4. **Updates**: YouTube changes karta rehta hai, code update karna padega

## Video ID Extract Karna

```javascript
function extractVideoId(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    throw new Error('Invalid YouTube URL');
}

// Usage
const videoId = extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

## Conclusion

ytdl-core library sabse reliable hai YouTube video information ke liye bina API key ke. Ye library regularly update hoti rehti hai aur YouTube ke changes ke saath compatible rehti hai.
