const initial_color_template = ['#fe346e','#7f78d2','#721b65','#f8615a','#2c003e'];
const icons_list = document.querySelectorAll('li');
const palette_icon = icons_list[0];
const refresh_icon = icons_list[1];
let colors_from_palette = [];
const floating_bubble_wrapper = document.querySelector('.floating-bubble-wrapper');


// setting the initial_color_template to the web page.
const palette_wrapper = document.querySelectorAll('.palette-wrapper');
  const nav = document.querySelector('nav');
const colorTextSpans = document.querySelectorAll('.colorText');
nav.style.backgroundColor = initial_color_template[initial_color_template.length-1] + "aa";
initial_color_template.forEach((color, i) => {
  palette_wrapper[i].style.backgroundColor = initial_color_template[i];
  colorTextSpans[i].textContent = initial_color_template[i];
});

// reacting to the clicks
palette_icon.addEventListener('click',e=>{
  e.preventDefault();
  if(floating_bubble_wrapper.style.display == "flex"){
    floating_bubble_wrapper.style.display = "none";
  }else{
    floating_bubble_wrapper.style.display = "flex";
  }
});
// clicking the lockers
const initial_open_lock = document.querySelectorAll('.initial_open');
const initial_close_lock = document.querySelectorAll('.initial_close');

// closing the opened locks
initial_open_lock.forEach((openLock, i) => {
  openLock.addEventListener('click',e=>{
    e.preventDefault();
    openLock.style.display = "none";
    initial_close_lock[i].style.display = "flex";
    palette_wrapper[i].classList.add('palette-locked-wrapper');
  });
});

// opening the closed locks
initial_close_lock.forEach((closeLock, i) => {
  closeLock.addEventListener('click',e=>{
    e.preventDefault();
    closeLock.style.display = "none";
    initial_open_lock[i].style.display = "flex";
    palette_wrapper[i].classList.remove('palette-locked-wrapper');
  });
});

const floating_bubble = document.querySelector('.floating-bubble');
const hiding_floating_bubble = document.querySelector('.hide-floating-bubble');

floating_bubble.addEventListener('click',e=>{
  e.preventDefault();
  floating_bubble.style.display = "none";
  hiding_floating_bubble.style.display = "flex";
  floating_bubble_wrapper.style.pointerEvents = "all";
});


// adding pickr js to load the color pallete
const pickr = Pickr.create({
    el: '.color_palette',
    theme: 'nano', // or 'monolith', or 'nano'
    container:'body',
    defaultRepresentation:'HEX',
    closeWithKey: 'Escape',
    swatches: [
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 0.95)',
        'rgba(156, 39, 176, 0.9)',
        'rgba(103, 58, 183, 0.85)',
        'rgba(63, 81, 181, 0.8)',
        'rgba(33, 150, 243, 0.75)',
        'rgba(3, 169, 244, 0.7)',
        'rgba(0, 188, 212, 0.7)',
        'rgba(0, 150, 136, 0.75)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(139, 195, 74, 0.85)',
        'rgba(205, 220, 57, 0.9)',
        'rgba(255, 235, 59, 0.95)',
        'rgba(255, 193, 7, 1)'
    ],
    components: {
        // Main components
        // palette: true,
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          input:true,
            clear: false,
            save: true,
            cancel:true
        }
    },
    strings:{
      save:'Save',
      cancel:'Cancel'
    }
});

// saving the color to an list ,this list will be stored in the database!
const modal = document.querySelector('.modal');
const colorSpans = document.querySelectorAll('.color_list_item');
const messageSpan = document.getElementById('message');
const generateSchemaBtn = document.querySelector('.generateSchema');
let remainingMessage = ' more colors are required!!!';
const finalMessage = 'Generate your palette???';

// on listening to a save event
pickr.on('save',(color,instance)=>{
  let colorSelected = color.toHEXA().toString();
  colors_from_palette.push(colorSelected);
  colors_from_palette.forEach((color, i) => {
    if(color){
      colorSpans[i].style.backgroundColor = colors_from_palette[i];
    }
  });
  let remainigCount = 5 - colors_from_palette.length;
  modal.style.display = "flex";
  if(remainigCount != 0){
    messageSpan.textContent = remainigCount + remainingMessage;
    setTimeout(()=>modal.style.display = "none",1500);
    generateSchemaBtn.style.display = "none";
  }else{
    messageSpan.textContent = finalMessage;
    generateSchemaBtn.style.display = "inline";
  }
  pickr.hide();

});

// on listening to a cancel event!
pickr.on('cancel',instance=>{
  hiding_floating_bubble.style.display = "none";
  floating_bubble.style.display = "flex";
  colors_from_palette = [];
  resetColors(colors_from_palette);
  floating_bubble_wrapper.style.pointerEvents = "none";
  floating_bubble_wrapper.style.display = "none";
  pickr.hide();
});

generateSchemaBtn.addEventListener('click',e=>{
  e.preventDefault();
  colors_from_palette.forEach((color, i) => {
    palette_wrapper[i].style.backgroundColor = colors_from_palette[i];
  });
  modal.style.display = "none";
  // add this color palette to the database!
  // clear the list after adding to the database!
  colors_from_palette = [];
  resetColors(colors_from_palette);
  floating_bubble_wrapper.style.pointerEvents = "none";
  floating_bubble_wrapper.style.display = "none";

});


function resetColors(colors_list){
  if(colors_list.length == 0){
    colorSpans.forEach((colorSpan, i) => {
      colorSpan.style.backgroundColor = "#fff";
    });
  }
}


// automatic generation of random color palettes!
refresh_icon.addEventListener('click',e=>{
  floating_bubble_wrapper.style.display = "none";
  let random_list = getRandomColorsList();
  palette_wrapper.forEach((palette, i) => {
    palette.style.backgroundColor = random_list[i];
  });
});

// BUG: THE COLORS ARE NOT GETTING INTO THE DOM AS PER THOUGHT!

// responding to the click on the palette
// window.onload = function(){
//   for(let i = 0;i<colorTextSpans.length;i++){
//     // console.log(i);
//     colorTextSpans[i].addEventListener('click',e=>{
//         if(colorTextSpans[i].parentElement.children[1].innerText === 'lock_open'){
//           e.preventDefault();
//           let patterns = ["","","","",""];
//           floating_bubble_wrapper.style.display = "flex";
//           colorTextSpans[i].parentElement.classList.add('highlight');
//           pickr.on('save',(color,instance)=>{
//               let color_received = color.toHEXA().toString();
//               patterns.push(color_received);
//               console.log(patterns[patterns.length-1]);
//               modal.style.display = "none";
//               colorTextSpans[i].parentElement.style.backgroundColor = color_received;
//               colorTextSpans[i].parentElement.children[0].textContent = color_received;
//               colorTextSpans[i].parentElement.classList.remove('highlight');
//               colorTextSpans[i].parentElement.children[1].children[0].style.display = "none";
//               colorTextSpans[i].parentElement.children[1].children[1].style.display = "flex";
//               floating_bubble_wrapper.style.display = "none";
//               colorTextSpans[i].parentElement.classList.add('palette-locked-wrapper');
//
//           });
//           pickr.on('cancel',(instance)=>{
//             e.target.parentElement.classList.remove('highlight');
//             e.target.parentElement.children[1].children[0].style.display = "flex";
//             e.target.parentElement.children[1].children[1].style.display = "none";
//           });
//           pickr.hide();
//         }else{
//           console.log('sorry this color is locked!');
//         }
//
//     });
//   }
//
// }


// Frames  implementation javascript!
