/**
 *                                                   . /#..                          
 *                                     . ((          .,##,.                          
 *                                        ###         ### .        (                 
 *                ,                      . .###       ###        /##                 
 *                ,########  .             . (##/    .##..    .###. .                
 *                ###########/                   ,           ###,                    
 *                .#############.                           .   ,                    
 *                   /#############. .                                               
 *                   .  #############(                                               
 *                      .  #############. .                          . .#######  ,   
 *                           /############/                           ########### ,  
 *                           ,  #############                        #############   
 *                                (#############. .                (############( ,  
 *                          ,      .,. .#############/            , /#############.     
 *                       ,#######    , .#############(         /############## .     
 *                      /###########  ,   /#################################  ,      
 *                       (############,   .  #############################/ .        
 *              .      . . ,############(  ,    #########################,           
 *            . (#######      ##############  ,,  ######################             
 *             ###########. .,  ,#############      /#################               
 *            ..#############, .,   #############     ##############/                
 *             ,  #############(      (###########    ,#############(                
 *                   #############. .   .#########,   ,###############  
 *     . ########  ,    ############/  ,,   ###(     .#################  
 *     ###########/   ,  #############, .       . .####################,             
 *    ..#############  ,    ############ ,. (###########################            
 *      (#############. ,,  #########( ,. (###########################( ,         
 *      . ,#############/   ,  #### . ,. /############################# ,         
 *            #############  .      .  /##############################(           
 *              (###########,    ####################################(            
 *              . .#########.   /###################################. .           
 *                   (####/     ##################################. .             
 *                            ################################(                   
 *                       ,  #############################    .                    
 *                         , .######################,   ,                         
 *                               ##############                                   
 *                                ..        ..                                    
 *                                                        
 *
 *
 * 09/Sep/2022
 * Code copied from https://github.com/SnapLocal/api-snaplocal-com.git
 *
**/

const express = require("express");
const vibrant = require('node-vibrant');

const PROG = 'api_get_image_background_color.js';

const CONFIG = require('./CONFIG.json');
const BIND_ADDRESS = CONFIG.bind_address;
const BIND_PORT = CONFIG.bind_port;

const app = express();

app.get("/", async (httpreq, httpres) => {

  console.log('Received incoming query: '+JSON.stringify(httpreq.query));

  const img_src = httpreq.query.imgsrc;

  console.log('IMGSRC: '+img_src);

  if (!img_src) {
    httpres.json({ iserr: true, errmsg : 'Did not receive imgsrc' });
    return;
  }

  const res = await vibrant.from(img_src).getPalette();

  console.log('vibrant res: '+JSON.stringify(res));
  console.log('vibrant res.Vibrant: '+JSON.stringify(res.Vibrant));
  console.log('vibrant res.Vibrant.rgb: '+JSON.stringify(res.Vibrant.rgb));

  // Example res
  // {"Vibrant":{"rgb":[76,180,116],"population":2273},"DarkVibrant":{"rgb":[39.1535433070866,93.4464566929134,60.03543307086614],"population":0},"LightVibrant":{"rgb":[157,220,195],"population":33},"Muted":{"rgb":[84,180,116],"population":14},"DarkMuted":{"rgb":[45.1771653543307,107.82283464566929,69.27165354330708],"population":0},"LightMuted":{"rgb":[157,212,160],"population":42}}

  let background_color_hex = '#ffffff';

  try {
    //const background_color_rgb = res.Vibrant.rgb;
    const background_color_rgb = res.LightMuted.rgb;
    console.log('vibrant res.Vibrant.rgb: '+background_color_rgb);
    const background_color_r = parseInt(background_color_rgb[0]);
    const background_color_g = parseInt(background_color_rgb[1]);
    const background_color_b = parseInt(background_color_rgb[2]);
    background_color_hex = '#'+full_color_hex(background_color_r,background_color_g,background_color_b);
    console.log('Note: Background Color for Image identified as '+background_color_hex);
  }
  catch (e) {
    console.log('Exception occured: '+JSON.stringify(e));
    httpres.json({ iserr: true, errortext : 'Error Processing' });
    return;
  }

  httpres.json({ iserr: false, color : background_color_hex });

});


// Start listening for requests
const http_server = app.listen(BIND_PORT, () => {
  console.log(PROG+'> Listening for incoming HTTP requests on port %d', http_server.address().port);
});

const rgb_to_hex = (rgb) => { 
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;
};

const full_color_hex = (r,g,b) => {
  const red = rgb_to_hex(r);
  const green = rgb_to_hex(g);
  const blue = rgb_to_hex(b);
  return red+green+blue;
}



  
  


