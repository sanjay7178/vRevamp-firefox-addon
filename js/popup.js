
let viewOfflineButton = document.getElementById("view-offline")

viewOfflineButton.addEventListener("click", ()=>{
    chrome.runtime.sendMessage({
        message: "showOfflinePage",
    });  
});

// logout.style.display="none";
// login.addEventListener("click",()=>{
//     chrome.runtime.sendMessage({
//         message: "login",
//     });  
//     window.close();
// });

// logout.addEventListener("click",()=>{
//     chrome.runtime.sendMessage({
//         message: "logout",
//     });
//     window.close();
// });

// chrome.storage.sync.get(["token"],(token)=>{
//     if(token.token != null){
//         login.style.display="none";
//         logout.style.display="";
//         // console.log(token.token);
//     }
//     else{
//         login.style.display="";
//         logout.style.display="none";
//     }
// });
