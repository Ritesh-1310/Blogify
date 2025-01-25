// deepLinkHandler.js
(function () {
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.user.eduquick";
    const websiteUrl = "https://eduquick.in";
  
    // The current URL, which is already the deep link
    const deepLinkUrl = window.location.href;
  
    // Create an invisible iframe to attempt opening the app
    const redirectToApp = () => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = deepLinkUrl;
      document.body.appendChild(iframe);
  
      setTimeout(() => {
        // Redirect to the Play Store after 2 seconds if the app is not installed
        window.location.href = playStoreUrl;
      }, 1000);
    };
  
    // Check if the user is on a mobile device
    const isMobileDevice = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
  
    if (isMobileDevice) {
      redirectToApp();
    } else {
      // Redirect non-mobile users to the EduQuick website
      window.location.href = websiteUrl; 
      // alert("Please open this link on your mobile device.");
    }
  })();
  