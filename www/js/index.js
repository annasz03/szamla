document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

document.addEventListener('DOMContentLoaded', function() {
    const sidemenu = document.querySelector("aside");
    const menuButton = document.querySelector("#menubutton");
    const closeButton = document.querySelector("#closebutton");
    
    sidemenu.style.display = 'none';
    
    menuButton.addEventListener('click', () => {
        sidemenu.style.display = 'block';
        menuButton.style.display = 'none';
    });

    closeButton.addEventListener('click', () => {
        sidemenu.style.display = 'none';
        menuButton.style.display = 'block';
    });

});