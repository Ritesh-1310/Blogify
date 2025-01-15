// deeplink.js

function openDeepLink(url, fallbackUrl) {
    var timeout;

    // Try to open the deep link in the app
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;

    document.body.appendChild(iframe);

    // Wait for a timeout to check if the deep link worked
    timeout = setTimeout(function() {
        window.location = fallbackUrl;  // If app is not installed, fallback to Play Store
    }, 2000);  // Adjust the timeout as necessary

    iframe.onload = function() {
        clearTimeout(timeout);
    };
}

// Extract parameters from the current URL and construct the dynamic deep link
function getDynamicDeepLinkUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const courseId = urlParams.get('courseId');
    const videoIds = urlParams.get('videoIds');
    const selectedIndex = urlParams.get('selectedIndex');

    // Check if the parameters exist; if not, use defaults
    if (!courseId || !videoIds || selectedIndex === null) {
        console.error('Required parameters missing!');
        return null;
    }

    // Construct the deep link URL for your website
    return `https://blogify-bice-rho.vercel.app/video?courseId=${courseId}&videoIds=${videoIds}&selectedIndex=${selectedIndex}`;
}

// Call the function on page load or as needed
window.onload = function() {
    const deepLinkUrl = getDynamicDeepLinkUrl();  // Generate dynamic deep link
    if (deepLinkUrl) {
        const playStoreUrl = "https://play.google.com/store/apps/details?id=com.yourcompany.eduquick"; // Play Store URL

        openDeepLink(deepLinkUrl, playStoreUrl);
    } else {
        console.log('Dynamic deep link URL generation failed');
    }
};
