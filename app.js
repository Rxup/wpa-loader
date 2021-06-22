function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


// Registering Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/wpa-loader/sw.js')
    .then((reg) => {
        // регистрация сработала
        console.log('Registration succeeded. Scope is ' + reg.scope);
      }).catch((error) => {
        // регистрация прошла неудачно
        console.log('Registration failed with ' + error);
      });
}

$(async ()=>{
    let device = await localforage.getItem("device-uuid");
    if(!device){
        device = uuidv4();//;
        await localforage.setItem("device-uuid",device);
    }
    let resp = await fetch("/wpa-loader/conf/"+device+".json", {cache: "no-store"});
    //console.log(resp);

    if(resp.status == 404){
        $(".loader").remove();
        $("body").append('<div class="frame">Данный терминал не зарегистрарован! требуется регистратция!<br/>Ид: '+device+'</div>');
    }
    if(resp.ok){
        let result = await resp.json();
        let goto = String(result.goto);
        if(result && result.goto && goto.startsWith("http")){
            $(".loader").remove();
            $('<iframe frameBorder="0" width="100%" height="100%"></iframe>').attr("src",goto+(goto.indexOf("?") == -1 ? "?"+device : "&")+"device="+device).appendTo('body');
        }
        //console.log(result);
        //location = result.goto;
    }
});
