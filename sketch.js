const urlParams = new URLSearchParams(window.location.search);

const rawDebug = urlParams.get('debug');
const rawMemberName = urlParams.get('member')?.trim();
const rawRandomNumber = urlParams.get('random')?.trim();

const params = {
  debug: rawDebug === 'false' ? false : rawDebug !== null,
  memberName: rawMemberName,
  randomNumber: Number.isNaN(Number.parseInt(rawRandomNumber))
    ? null
    : rawRandomNumber, // If number is valid number, store it
};

if (params.debug) console.table(params);

let x;
let y;

let whistle;
let sel;
let number;
let download;
const stepSize = 4;
const membersArray = JSON.parse(members).sort((a, b) => a.name > b.name ? 1 : -1);

function setup() {
  createCanvas(4880 / stepSize, 1500 / stepSize);
  sel = createSelect();
  sel.option('Select Member');
  membersArray.forEach((member, index) => {
    sel.option(`${index} ${member.name} ${member.random}`);
  });
  sel.changed(onSelChange);
  number = createInput(params.randomNumber || '123456');
  let button = createButton('Generate');
  button.mousePressed(randomWalk);
  download = createCheckbox('Download');
  download.checked(true);
  pixelDensity(1);
  whistle = createGraphics(4880, 1500);
  whistle.pixelDensity(1);
  background(200);
}

function onSelChange() {
  if (sel.value() !== 'Select Member') {
    let memberID = sel.value().split(' ')[0];
    number.value(membersArray[memberID].random);
  }
}

function randomWalk() {
  whistle.background(255);
  x = whistle.width / 2;
  y = whistle.height / 2;
  randomSeed(parseInt(number.value()));
  for (let i = 0; i < 1000000; i++) {
    //canvas.stroke(0);
    //canvas.point(x, y);
    whistle.noStroke();
    whistle.fill(0);
    whistle.rectMode(CENTER);
    whistle.rect(x, y, stepSize, stepSize);
    whistle.strokeWeight(stepSize);
    const r = int(random(4));

    switch (r) {
      case 0:
        x = x + stepSize;
        break;
      case 1:
        x = x - stepSize;
        break;
      case 2:
        y = y + stepSize;
        break;
      case 3:
        y = y - stepSize;
        break;
    }

    if (x < stepSize / 2) {
      x = whistle.width - stepSize / 2;
    } else if (x > whistle.width - stepSize / 2) {
      x = stepSize / 2;
    }
    if (y < stepSize / 2) {
      y = whistle.height - stepSize / 2;
    } else if (y > whistle.height - stepSize / 2) {
      y = stepSize / 2;
    }
  }

  if (download.checked()) {
    whistle.save('randomwalk.png');
  }
  imageMode(CORNER);
  image(whistle, 0, 0, width, height);
  noLoop();
}
