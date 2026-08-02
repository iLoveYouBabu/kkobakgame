const BOARD_WIDTH = 360;
const BOARD_HEIGHT = 600;
const WALL_THICKNESS = 40;
const DROP_COOLDOWN = 450;
const DROP_TOP_MARGIN = 8;
const NEXT_FRUIT_COUNT = 3;

const GAME_OVER_LINE_Y = 120;
const GAME_OVER_WARNING_Y = 190;
const GAME_OVER_HOLD_TIME = 1200;
const GAME_OVER_SPAWN_GRACE_TIME = 950;
const GAME_OVER_MAX_SPEED = 1.2;
const GAME_OVER_MAX_ANGULAR_SPEED = 0.12;

const INITIAL_ANGLE_RANGE = 0.045;
const MERGE_VELOCITY_RATIO = 0.72;
const MERGE_ANGULAR_VELOCITY_RATIO = 0.4;
const MAX_MERGE_ANGULAR_VELOCITY = 0.04;
const BODY_INERTIA_RATIO = 0.95;

// 처음 떨어질 수 있는 과일 단계: 0~2
const DROP_LEVEL_MAX = 2;

/*
 * 각 이미지의 투명 영역을 제외한 볼록 외곽선을 정규화한 좌표입니다.
 * 단순화 과정에서도 실제 불투명 픽셀 전체를 감싸도록 바깥으로 보정했습니다.
 */
const FRUITS = [
  {
    "name": "체리",
    "radius": 18,
    "color": "#ff7675",
    "score": 2,
    "image": "./assets/fruits/fruit-1.png",
    "imageWidth": 647,
    "imageHeight": 768,
    "centroidX": 0.471497,
    "centroidY": 0.522746,
    "vertices": [
      [
        0.59487,
        0.00071
      ],
      [
        0.37801,
        0.00738
      ],
      [
        0.21814,
        0.03938
      ],
      [
        0.10575,
        0.17807
      ],
      [
        0.07409,
        0.24341
      ],
      [
        0.02027,
        0.61013
      ],
      [
        0.00919,
        0.7955
      ],
      [
        0.13107,
        0.91551
      ],
      [
        0.23396,
        0.95952
      ],
      [
        0.34319,
        0.98619
      ],
      [
        0.52522,
        0.99553
      ],
      [
        0.68668,
        0.96886
      ],
      [
        0.8149,
        0.91551
      ],
      [
        0.9637,
        0.82083
      ],
      [
        0.99377,
        0.78083
      ],
      [
        0.99219,
        0.74349
      ],
      [
        0.75475,
        0.11273
      ],
      [
        0.67402,
        0.01671
      ]
    ]
  },
  {
    "name": "딸기",
    "radius": 24,
    "color": "#e84393",
    "score": 4,
    "image": "./assets/fruits/fruit-2.png",
    "imageWidth": 674,
    "imageHeight": 768,
    "centroidX": 0.50185,
    "centroidY": 0.482591,
    "vertices": [
      [
        0.74759,
        0.00605
      ],
      [
        0.38522,
        0.00605
      ],
      [
        0.19195,
        0.0352
      ],
      [
        0.10891,
        0.08026
      ],
      [
        0.07871,
        0.11471
      ],
      [
        0.00623,
        0.61161
      ],
      [
        0.00472,
        0.67124
      ],
      [
        0.03492,
        0.79713
      ],
      [
        0.07116,
        0.83555
      ],
      [
        0.17534,
        0.89916
      ],
      [
        0.5045,
        0.99986
      ],
      [
        0.89254,
        0.86603
      ],
      [
        0.95897,
        0.79845
      ],
      [
        0.97407,
        0.77195
      ],
      [
        0.99521,
        0.58644
      ],
      [
        0.92425,
        0.11073
      ],
      [
        0.88348,
        0.06303
      ],
      [
        0.84724,
        0.02725
      ]
    ]
  },
  {
    "name": "포도",
    "radius": 32,
    "color": "#6c5ce7",
    "score": 8,
    "image": "./assets/fruits/fruit-3.png",
    "imageWidth": 647,
    "imageHeight": 768,
    "centroidX": 0.500299,
    "centroidY": 0.52779,
    "vertices": [
      [
        0.47708,
        -0.00254
      ],
      [
        0.37278,
        0.02408
      ],
      [
        0.23055,
        0.09465
      ],
      [
        0.09306,
        0.22246
      ],
      [
        0.01562,
        0.60588
      ],
      [
        0.00298,
        0.77496
      ],
      [
        0.06461,
        0.88413
      ],
      [
        0.19894,
        0.95203
      ],
      [
        0.38068,
        0.99331
      ],
      [
        0.64459,
        0.99064
      ],
      [
        0.85952,
        0.94671
      ],
      [
        0.93854,
        0.9081
      ],
      [
        0.99543,
        0.76698
      ],
      [
        0.99227,
        0.70707
      ],
      [
        0.8769,
        0.17586
      ],
      [
        0.85162,
        0.12926
      ],
      [
        0.81685,
        0.09065
      ],
      [
        0.62089,
        0.00411
      ]
    ]
  },
  {
    "name": "귤",
    "radius": 42,
    "color": "#fdcb6e",
    "score": 16,
    "image": "./assets/fruits/fruit-4.png",
    "imageWidth": 626,
    "imageHeight": 768,
    "centroidX": 0.465128,
    "centroidY": 0.522048,
    "vertices": [
      [
        0.47798,
        -0.00493
      ],
      [
        0.14482,
        0.02851
      ],
      [
        0.05948,
        0.13419
      ],
      [
        0.04306,
        0.18636
      ],
      [
        0.00039,
        0.81644
      ],
      [
        0.01352,
        0.85657
      ],
      [
        0.05455,
        0.89537
      ],
      [
        0.176,
        0.95289
      ],
      [
        0.33519,
        0.99035
      ],
      [
        0.52229,
        1.00105
      ],
      [
        0.69626,
        0.98232
      ],
      [
        0.85873,
        0.93684
      ],
      [
        0.97526,
        0.86861
      ],
      [
        0.99824,
        0.81243
      ],
      [
        0.86858,
        0.34021
      ],
      [
        0.7619,
        0.11413
      ],
      [
        0.66836,
        0.02851
      ],
      [
        0.59779,
        0.00711
      ]
    ]
  },
  {
    "name": "사과",
    "radius": 54,
    "color": "#d63031",
    "score": 32,
    "image": "./assets/fruits/fruit-5.png",
    "imageWidth": 641,
    "imageHeight": 768,
    "centroidX": 0.467888,
    "centroidY": 0.537357,
    "vertices": [
      [
        0.47443,
        -0.00486
      ],
      [
        0.28867,
        0.01652
      ],
      [
        0.09491,
        0.20765
      ],
      [
        0.05327,
        0.28517
      ],
      [
        0.00363,
        0.79171
      ],
      [
        0.04046,
        0.88393
      ],
      [
        0.0885,
        0.93205
      ],
      [
        0.16377,
        0.96947
      ],
      [
        0.25504,
        0.99219
      ],
      [
        0.51286,
        0.99219
      ],
      [
        0.74025,
        0.94675
      ],
      [
        0.89878,
        0.87725
      ],
      [
        0.95483,
        0.83181
      ],
      [
        0.99646,
        0.76097
      ],
      [
        0.96284,
        0.59257
      ],
      [
        0.78028,
        0.19027
      ],
      [
        0.6842,
        0.09137
      ],
      [
        0.51286,
        0.00316
      ]
    ]
  },
  {
    "name": "배",
    "radius": 68,
    "color": "#ffeaa7",
    "score": 64,
    "image": "./assets/fruits/fruit-6.png",
    "imageWidth": 480,
    "imageHeight": 768,
    "centroidX": 0.415061,
    "centroidY": 0.517319,
    "vertices": [
      [
        0.0006,
        -0.00449
      ],
      [
        0.0006,
        1.00287
      ],
      [
        0.7466,
        0.85446
      ],
      [
        0.80124,
        0.8387
      ],
      [
        0.84116,
        0.82557
      ],
      [
        0.87058,
        0.80981
      ],
      [
        0.91471,
        0.7796
      ],
      [
        0.95254,
        0.74414
      ],
      [
        0.97145,
        0.71656
      ],
      [
        0.98196,
        0.69423
      ],
      [
        0.99036,
        0.65351
      ],
      [
        0.98826,
        0.61017
      ],
      [
        0.98616,
        0.59704
      ],
      [
        0.97775,
        0.57209
      ],
      [
        0.96515,
        0.54582
      ],
      [
        0.84326,
        0.32911
      ],
      [
        0.64573,
        0.14918
      ],
      [
        0.62892,
        0.1413
      ]
    ]
  },
  {
    "name": "복숭아",
    "radius": 82,
    "color": "#fab1a0",
    "score": 128,
    "image": "./assets/fruits/fruit-7.png",
    "imageWidth": 630,
    "imageHeight": 768,
    "centroidX": 0.496371,
    "centroidY": 0.538156,
    "vertices": [
      [
        0.45132,
        -0.00365
      ],
      [
        0.36354,
        0.01635
      ],
      [
        0.28226,
        0.05903
      ],
      [
        0.05793,
        0.28305
      ],
      [
        0.00266,
        0.6631
      ],
      [
        0.00266,
        0.78578
      ],
      [
        0.02379,
        0.82579
      ],
      [
        0.06768,
        0.86579
      ],
      [
        0.23024,
        0.95113
      ],
      [
        0.34891,
        0.99914
      ],
      [
        0.76994,
        0.98981
      ],
      [
        0.89348,
        0.9338
      ],
      [
        0.95363,
        0.88713
      ],
      [
        0.99915,
        0.62976
      ],
      [
        0.92599,
        0.34573
      ],
      [
        0.8756,
        0.23505
      ],
      [
        0.67078,
        0.06569
      ],
      [
        0.58137,
        0.01502
      ]
    ]
  },
  {
    "name": "파인애플",
    "radius": 98,
    "color": "#f9ca24",
    "score": 256,
    "image": "./assets/fruits/fruit-8.png",
    "imageWidth": 694,
    "imageHeight": 768,
    "centroidX": 0.497133,
    "centroidY": 0.53623,
    "vertices": [
      [
        0.51778,
        -0.00245
      ],
      [
        0.2624,
        0.00422
      ],
      [
        0.20778,
        0.06558
      ],
      [
        0.16645,
        0.14295
      ],
      [
        0.01588,
        0.59516
      ],
      [
        -0.00036,
        0.68853
      ],
      [
        0.04098,
        0.88329
      ],
      [
        0.09855,
        0.95266
      ],
      [
        0.16055,
        0.98467
      ],
      [
        0.54583,
        0.99801
      ],
      [
        0.7215,
        0.98867
      ],
      [
        0.91783,
        0.95132
      ],
      [
        0.97688,
        0.86462
      ],
      [
        0.99755,
        0.71521
      ],
      [
        0.92817,
        0.41241
      ],
      [
        0.8204,
        0.14161
      ],
      [
        0.77907,
        0.08692
      ],
      [
        0.70083,
        0.02689
      ]
    ]
  },
  {
    "name": "멜론",
    "radius": 115,
    "color": "#badc58",
    "score": 512,
    "image": "./assets/fruits/fruit-9.png",
    "imageWidth": 616,
    "imageHeight": 768,
    "centroidX": 0.497866,
    "centroidY": 0.561608,
    "vertices": [
      [
        0.47529,
        0.00023
      ],
      [
        0.37303,
        0.02273
      ],
      [
        0.2988,
        0.06903
      ],
      [
        0.26086,
        0.11004
      ],
      [
        0.14375,
        0.30717
      ],
      [
        0.01014,
        0.59691
      ],
      [
        0.00519,
        0.82182
      ],
      [
        0.02334,
        0.9065
      ],
      [
        0.06457,
        0.95809
      ],
      [
        0.15035,
        0.98985
      ],
      [
        0.80848,
        0.99117
      ],
      [
        0.9157,
        0.94883
      ],
      [
        0.96683,
        0.8549
      ],
      [
        0.99487,
        0.62205
      ],
      [
        0.98993,
        0.59427
      ],
      [
        0.87446,
        0.286
      ],
      [
        0.62539,
        0.02405
      ],
      [
        0.59735,
        0.01346
      ]
    ]
  },
  {
    "name": "수박",
    "radius": 135,
    "color": "#6ab04c",
    "score": 1024,
    "image": "./assets/fruits/fruit-10.png",
    "imageWidth": 597,
    "imageHeight": 768,
    "centroidX": 0.486596,
    "centroidY": 0.563406,
    "vertices": [
      [
        0.54568,
        0.00341
      ],
      [
        0.38129,
        0.00074
      ],
      [
        0.34361,
        0.01272
      ],
      [
        0.24258,
        0.05931
      ],
      [
        0.19635,
        0.09525
      ],
      [
        0.02853,
        0.5891
      ],
      [
        -0.00058,
        0.76747
      ],
      [
        0.00627,
        0.90857
      ],
      [
        0.03538,
        0.93919
      ],
      [
        0.10559,
        0.96981
      ],
      [
        0.17751,
        0.98179
      ],
      [
        0.57136,
        0.99776
      ],
      [
        0.86076,
        0.95649
      ],
      [
        0.94124,
        0.92588
      ],
      [
        0.98919,
        0.88328
      ],
      [
        1.00974,
        0.75949
      ],
      [
        0.98405,
        0.52521
      ],
      [
        0.57821,
        0.0247
      ]
    ]
  }
];

const {
  Engine,
  Render,
  Runner,
  Bodies,
  Body,
  Composite,
  Events
} = Matter;

const loginScreen = document.querySelector("#loginScreen");
const gameScreen = document.querySelector("#gameScreen");
const nicknameInput = document.querySelector("#nickname");
const startButton = document.querySelector("#startButton");
const playerName = document.querySelector("#playerName");
const scoreElement = document.querySelector("#score");
const message = document.querySelector("#message");
const gameContainer = document.querySelector("#gameContainer");
const aimFruit = document.querySelector("#aimFruit");
const dropGuide = document.querySelector("#dropGuide");
const gameOverLine = document.querySelector("#gameOverLine");
const nextFruitList = document.querySelector("#nextFruitList");
const gameOverModal = document.querySelector("#gameOverModal");
const finalScore = document.querySelector("#finalScore");
const closeGameOverButton = document.querySelector("#closeGameOverButton");

let engine = null;
let render = null;
let runner = null;
let score = 0;
let currentFruitLevel = 0;
let nextFruitLevels = [];
let aimX = BOARD_WIDTH / 2;
let canDrop = false;
let dropReadyTimer = null;
let activeDragPointerId = null;
let isGameOver = false;
let isStarting = false;
let dangerStartedAt = null;

// 같은 과일이 동시에 여러 번 합쳐지는 것을 방지하기 위한 Body ID 목록
const mergingBodyIds = new Set();
const fruitImagesReady = preloadFruitImages();

const savedNickname = localStorage.getItem("kkobakNickname");

if (savedNickname) {
  nicknameInput.value = savedNickname;
}

startButton.addEventListener("click", startGame);
nicknameInput.addEventListener("keydown", handleNicknameKeydown);
closeGameOverButton.addEventListener("click", returnToStartScreen);

/**
 * 게임에 사용하는 모든 과일 이미지를 브라우저 캐시에 미리 불러옵니다.
 * 첫 과일이나 합체 과일이 잠깐 투명하게 보이는 현상을 줄입니다.
 *
 * @returns {Promise<void>} 모든 이미지 로드 완료 Promise
 */
function preloadFruitImages() {
  const loaders = FRUITS.map((fruit) => {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.addEventListener("load", resolve, { once: true });
      image.addEventListener(
        "error",
        () => reject(new Error(`${fruit.name} 이미지 로드 실패`)),
        { once: true }
      );

      image.src = fruit.image;
    });
  });

  return Promise.all(loaders).then(() => undefined);
}

/**
 * 닉네임 입력창에서 키보드 입력을 처리합니다.
 * Enter 키를 누르면 게임을 시작합니다.
 *
 * @param {KeyboardEvent} event - 키보드 입력 이벤트
 * @returns {void}
 */
function handleNicknameKeydown(event) {
  if (event.key === "Enter") {
    startGame();
  }
}

/**
 * 닉네임과 이미지 로딩 상태를 확인한 뒤 게임을 시작합니다.
 * 입력한 닉네임은 브라우저의 localStorage에 저장합니다.
 *
 * @returns {Promise<void>} 게임 시작 처리 Promise
 */
async function startGame() {
  const nickname = nicknameInput.value.trim();

  if (!nickname) {
    message.textContent = "닉네임을 입력해주세요.";
    nicknameInput.focus();
    return;
  }

  if (isStarting) {
    return;
  }

  isStarting = true;
  startButton.disabled = true;
  startButton.textContent = "이미지 불러오는 중...";
  message.textContent = "";

  try {
    await fruitImagesReady;
  } catch (error) {
    console.error(error);
    message.textContent = "과일 이미지를 불러오지 못했습니다. 파일 경로를 확인해주세요.";
    startButton.disabled = false;
    startButton.textContent = "게임 시작";
    isStarting = false;
    return;
  }

  playerName.textContent = `${nickname}님`;
  loginScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  localStorage.setItem("kkobakNickname", nickname);

  initializeGame();
}

/**
 * Matter.js 물리엔진과 게임판을 생성합니다.
 *
 * @returns {void}
 */
function initializeGame() {
  engine = Engine.create({
    enableSleeping: true
  });
  engine.gravity.x = 0;
  engine.gravity.y = 1;

  // 복잡한 외곽 충돌체가 서로 파고들지 않도록 반복 계산을 강화합니다.
  engine.positionIterations = 10;
  engine.velocityIterations = 8;
  engine.constraintIterations = 4;

  render = Render.create({
    element: gameContainer,
    engine,
    options: {
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      wireframes: false,
      background: "#fffaf0",

      // 멈춘 과일도 투명하게 표시하지 않음
      showSleeping: false

    }
  });

  Render.setPixelRatio(
    render,
    Math.min(window.devicePixelRatio || 1, 3)
  );

  runner = Runner.create();

  createWalls();
  registerEngineEvents();
  registerBoardPointerEvents();
  setGameOverLinePosition();

  Render.run(render);
  Runner.run(runner, engine);

  prepareFirstFruit();
}

/**
 * 게임판의 왼쪽 벽, 오른쪽 벽, 바닥을 생성합니다.
 *
 * @returns {void}
 */
function createWalls() {
  const wallOptions = {
    isStatic: true,
    label: "wall",
    render: {
      fillStyle: "#292929"
    }
  };

  const floor = Bodies.rectangle(
    BOARD_WIDTH / 2,
    BOARD_HEIGHT + WALL_THICKNESS / 2,
    BOARD_WIDTH,
    WALL_THICKNESS,
    wallOptions
  );

  const leftWall = Bodies.rectangle(
    -WALL_THICKNESS / 2,
    BOARD_HEIGHT / 2,
    WALL_THICKNESS,
    BOARD_HEIGHT,
    wallOptions
  );

  const rightWall = Bodies.rectangle(
    BOARD_WIDTH + WALL_THICKNESS / 2,
    BOARD_HEIGHT / 2,
    WALL_THICKNESS,
    BOARD_HEIGHT,
    wallOptions
  );

  Composite.add(engine.world, [floor, leftWall, rightWall]);
}

/**
 * 충돌 및 매 프레임 게임오버 감시 이벤트를 등록합니다.
 *
 * @returns {void}
 */
function registerEngineEvents() {
  Events.on(engine, "collisionStart", handleCollisionStart);
  Events.on(engine, "afterUpdate", updateGameOverState);
}

/**
 * 게임판의 마우스 및 터치 이벤트를 등록합니다.
 *
 * @returns {void}
 */
function registerBoardPointerEvents() {
  render.canvas.addEventListener("pointermove", handleBoardPointerMove);
  render.canvas.addEventListener("pointerdown", handleBoardPointerDown);
  render.canvas.addEventListener("pointerup", handleBoardPointerUp);
  render.canvas.addEventListener("pointercancel", handleBoardPointerCancel);
}

/**
 * 포인터 이동에 따라 대기 과일의 가로 위치를 변경합니다.
 *
 * @param {PointerEvent} event - 포인터 이동 이벤트
 * @returns {void}
 */
function handleBoardPointerMove(event) {
  if (isGameOver) {
    return;
  }

  if (event.pointerType === "mouse") {
    updateAimPosition(event);
    return;
  }

  if (event.pointerId !== activeDragPointerId) {
    return;
  }

  event.preventDefault();
  updateAimPosition(event);
}

/**
 * PC에서는 즉시 낙하하고 모바일에서는 드래그를 시작합니다.
 *
 * @param {PointerEvent} event - 포인터 입력 시작 이벤트
 * @returns {void}
 */
function handleBoardPointerDown(event) {
  if (!event.isPrimary || !canDrop || isGameOver) {
    return;
  }

  if (event.pointerType === "mouse") {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    updateAimPosition(event);
    dropCurrentFruit();
    return;
  }

  event.preventDefault();
  activeDragPointerId = event.pointerId;
  updateAimPosition(event);
  render.canvas.setPointerCapture(event.pointerId);
}

/**
 * 모바일 드래그를 끝낸 위치에 과일을 떨어뜨립니다.
 *
 * @param {PointerEvent} event - 포인터 입력 종료 이벤트
 * @returns {void}
 */
function handleBoardPointerUp(event) {
  if (
    isGameOver ||
    event.pointerType === "mouse" ||
    event.pointerId !== activeDragPointerId
  ) {
    return;
  }

  event.preventDefault();
  updateAimPosition(event);
  releaseDragPointer(event.pointerId);
  dropCurrentFruit();
}

/**
 * 브라우저에서 모바일 드래그가 취소되면 상태만 정리합니다.
 *
 * @param {PointerEvent} event - 취소된 포인터 이벤트
 * @returns {void}
 */
function handleBoardPointerCancel(event) {
  if (event.pointerId === activeDragPointerId) {
    releaseDragPointer(event.pointerId);
  }
}

/**
 * 활성 드래그 포인터의 캡처를 안전하게 해제합니다.
 *
 * @param {number} pointerId - 해제할 포인터 ID
 * @returns {void}
 */
function releaseDragPointer(pointerId) {
  if (
    render?.canvas &&
    render.canvas.hasPointerCapture(pointerId)
  ) {
    render.canvas.releasePointerCapture(pointerId);
  }

  activeDragPointerId = null;
}

/**
 * 포인터 좌표를 게임판 좌표로 변환하여 대기 과일 위치를 변경합니다.
 *
 * @param {PointerEvent} event - 좌표를 가져올 포인터 이벤트
 * @returns {void}
 */
function updateAimPosition(event) {
  if (!render || isGameOver) {
    return;
  }

  aimX = clampFruitX(
    getBoardXFromPointer(event),
    currentFruitLevel
  );

  updateAimPreviewPosition();
}

/**
 * 화면 가로 좌표를 360px 기준 게임판 좌표로 변환합니다.
 *
 * @param {PointerEvent} event - 포인터 이벤트
 * @returns {number} 게임판 기준 가로 좌표
 */
function getBoardXFromPointer(event) {
  const canvasRect = render.canvas.getBoundingClientRect();

  return (
    (event.clientX - canvasRect.left) *
    (BOARD_WIDTH / canvasRect.width)
  );
}

/**
 * 과일 이미지의 표시 크기와 스프라이트 중심 기준 범위를 계산합니다.
 * 충돌체가 아닌 실제 이미지 전체를 기준으로 벽과 생성 위치를 맞춥니다.
 *
 * @param {number} level - 과일 단계
 * @returns {Object} 과일 이미지 표시 크기와 중심 기준 범위
 */
function getFruitMetrics(level) {
  const fruit = FRUITS[level];
  const scale =
    (fruit.radius * 2) /
    Math.max(fruit.imageWidth, fruit.imageHeight);

  const width = fruit.imageWidth * scale;
  const height = fruit.imageHeight * scale;

  return {
    scale,
    width,
    height,
    leftExtent: fruit.centroidX * width,
    rightExtent: (1 - fruit.centroidX) * width,
    topExtent: fruit.centroidY * height,
    bottomExtent: (1 - fruit.centroidY) * height
  };
}

/**
 * 사진 외곽 충돌체가 좌우 벽을 벗어나지 않도록 좌표를 제한합니다.
 *
 * @param {number} x - 보정할 가로 좌표
 * @param {number} level - 과일 단계
 * @returns {number} 보정된 가로 좌표
 */
function clampFruitX(x, level) {
  const metrics = getFruitMetrics(level);
  const minX = metrics.leftExtent + 4;
  const maxX = BOARD_WIDTH - metrics.rightExtent - 4;

  return Math.max(minX, Math.min(maxX, x));
}

/**
 * 첫 현재 과일과 다음 과일 세 개를 준비합니다.
 *
 * @returns {void}
 */
function prepareFirstFruit() {
  isGameOver = false;
  dangerStartedAt = null;
  currentFruitLevel = getRandomDropLevel();
  nextFruitLevels = Array.from(
    { length: NEXT_FRUIT_COUNT },
    getRandomDropLevel
  );
  aimX = clampFruitX(BOARD_WIDTH / 2, currentFruitLevel);
  canDrop = true;

  gameContainer.classList.remove("game-over", "danger-zone");
  gameOverLine.classList.add("hidden");
  gameOverLine.classList.remove("is-counting");

  updateAimPreview();
  updateNextFruitList();
  showAimControls();
}

/**
 * 다음 과일 큐를 한 칸 앞으로 이동합니다.
 *
 * @returns {void}
 */
function advanceFruitQueue() {
  currentFruitLevel = nextFruitLevels.shift();
  nextFruitLevels.push(getRandomDropLevel());
  aimX = clampFruitX(aimX, currentFruitLevel);

  updateAimPreview();
  updateNextFruitList();
}

/**
 * 처음 떨어질 과일 단계를 무작위로 결정합니다.
 *
 * @returns {number} 과일 단계
 */
function getRandomDropLevel() {
  return Math.floor(Math.random() * (DROP_LEVEL_MAX + 1));
}

/**
 * 현재 대기 과일을 월드에 추가합니다.
 * 시작 각도만 아주 조금 달리하고 강제 회전은 주지 않습니다.
 *
 * @returns {void}
 */
function dropCurrentFruit() {
  if (!canDrop || isGameOver) {
    return;
  }

  canDrop = false;
  hideAimControls();

  const metrics = getFruitMetrics(currentFruitLevel);
  const body = createFruitBody(
    aimX,
    metrics.topExtent + DROP_TOP_MARGIN,
    currentFruitLevel
  );

  Body.setAngle(
    body,
    (Math.random() - 0.5) * INITIAL_ANGLE_RANGE * 2
  );
  Body.setAngularVelocity(body, 0);

  Composite.add(engine.world, body);
  scheduleNextDrop();
}

/**
 * 낙하 쿨다운 종료 시 큐 변경과 입력 활성화를 동시에 수행합니다.
 *
 * @returns {void}
 */
function scheduleNextDrop() {
  clearDropReadyTimer();

  dropReadyTimer = window.setTimeout(() => {
    if (isGameOver) {
      dropReadyTimer = null;
      return;
    }

    advanceFruitQueue();
    canDrop = true;
    showAimControls();
    dropReadyTimer = null;
  }, DROP_COOLDOWN);
}

/**
 * 낙하 준비 타이머를 취소합니다.
 *
 * @returns {void}
 */
function clearDropReadyTimer() {
  if (dropReadyTimer !== null) {
    window.clearTimeout(dropReadyTimer);
    dropReadyTimer = null;
  }
}

/**
 * 현재 대기 과일 이미지를 실제 표시 비율과 무게중심에 맞춰 표시합니다.
 *
 * @returns {void}
 */
function updateAimPreview() {
  const fruit = FRUITS[currentFruitLevel];
  const metrics = getFruitMetrics(currentFruitLevel);

  aimFruit.style.width = `${(metrics.width / BOARD_WIDTH) * 100}%`;
  aimFruit.style.aspectRatio = `${fruit.imageWidth} / ${fruit.imageHeight}`;
  aimFruit.style.setProperty(
    "--fruit-anchor-x",
    `${fruit.centroidX * 100}%`
  );
  aimFruit.title = fruit.name;

  applyFruitPreviewStyle(aimFruit, fruit);
  updateAimPreviewPosition();
}

/**
 * 대기 과일과 낙하선의 가로 위치를 갱신합니다.
 *
 * @returns {void}
 */
function updateAimPreviewPosition() {
  const leftPercent = (aimX / BOARD_WIDTH) * 100;

  aimFruit.style.left = `${leftPercent}%`;
  dropGuide.style.left = `${leftPercent}%`;
}

/**
 * 다음 과일 세 개를 목록에 표시합니다.
 *
 * @returns {void}
 */
function updateNextFruitList() {
  const listItems = nextFruitLevels.map(createNextFruitListItem);
  nextFruitList.replaceChildren(...listItems);
}

/**
 * 다음 과일 목록 항목을 생성합니다.
 *
 * @param {number} level - 과일 단계
 * @param {number} index - 목록 순서
 * @returns {HTMLLIElement} 목록 항목
 */
function createNextFruitListItem(level, index) {
  const fruit = FRUITS[level];
  const item = document.createElement("li");
  const order = document.createElement("span");
  const preview = document.createElement("span");
  const name = document.createElement("strong");
  const previewSize = Math.min(30 + fruit.radius * 0.42, 48);

  item.className = "next-fruit-item";
  item.setAttribute(
    "aria-label",
    `${index + 1}번째 다음 과일 ${fruit.name}`
  );

  order.className = "next-fruit-order";
  order.textContent = String(index + 1);

  preview.className = "next-fruit-preview";
  preview.style.width = `${previewSize}px`;
  preview.style.aspectRatio =
    `${fruit.imageWidth} / ${fruit.imageHeight}`;
  preview.title = fruit.name;
  preview.setAttribute("aria-hidden", "true");
  applyFruitPreviewStyle(preview, fruit);

  name.className = "next-fruit-name";
  name.textContent = fruit.name;

  item.append(order, preview, name);
  return item;
}

/**
 * HTML 요소에 과일 이미지 스타일을 적용합니다.
 *
 * @param {HTMLElement} element - 미리보기 요소
 * @param {Object} fruit - 과일 데이터
 * @returns {void}
 */
function applyFruitPreviewStyle(element, fruit) {
  element.style.backgroundImage = `url("${fruit.image}")`;
  element.style.backgroundColor = "transparent";
  element.style.backgroundPosition = "center";
  element.style.backgroundRepeat = "no-repeat";
  element.style.backgroundSize = "contain";
  element.style.border = "0";
  element.style.borderRadius = "0";
  element.style.boxShadow = "none";
}

/**
 * 대기 과일과 낙하 안내선을 표시합니다.
 *
 * @returns {void}
 */
function showAimControls() {
  if (isGameOver) {
    return;
  }

  aimFruit.classList.remove("hidden");
  dropGuide.classList.remove("hidden");
}

/**
 * 대기 과일과 낙하 안내선을 숨깁니다.
 *
 * @returns {void}
 */
function hideAimControls() {
  aimFruit.classList.add("hidden");
  dropGuide.classList.add("hidden");
}

/**
 * PNG 알파 외곽선을 감싸는 단순화된 볼록 충돌체를 생성합니다.
 * 생성 후 Matter.js가 자동으로 더한 스프라이트 오프셋을 정확한
 * 이미지 무게중심 값으로 다시 지정하여 사진과 충돌체를 일치시킵니다.
 *
 * @param {number} x - 생성 가로 위치
 * @param {number} y - 생성 세로 위치
 * @param {number} level - 과일 단계
 * @returns {Matter.Body} 생성된 과일 Body
 */
function createFruitBody(x, y, level) {
  const fruit = FRUITS[level];
  const metrics = getFruitMetrics(level);
  const vertices = fruit.vertices.map(([normalizedX, normalizedY]) => {
    return {
      x: normalizedX * metrics.width,
      y: normalizedY * metrics.height
    };
  });

  const body = Bodies.fromVertices(
    x,
    y,
    vertices,
    {
      label: "fruit",
      restitution: 0.1,
      friction: 0.025,
      frictionStatic: 0.04,
      frictionAir: 0.006,
      slop: 0.05,
      sleepThreshold: 60,
      plugin: {
        fruitLevel: level,
        spawnedAt: performance.now()
      },
      render: {
        sprite: {
          texture: fruit.image,
          xScale: metrics.scale,
          yScale: metrics.scale
        }
      }
    },
    true,
    0.01,
    10,
    0.01
  );

  // Body 생성 과정에서 계산되는 자동 오프셋을 덮어써야
  // 이미지의 무게중심과 실제 충돌체 중심이 같은 위치에 놓입니다.
  body.render.sprite.xOffset = fruit.centroidX;
  body.render.sprite.yOffset = fruit.centroidY;

  // 지나치게 가볍게 빙글도는 현상을 줄이되 자연스러운 구름은 유지합니다.
  Body.setInertia(body, body.inertia * BODY_INERTIA_RATIO);

  return body;
}

/**
 * Matter.js 충돌 시작 이벤트를 처리합니다.
 *
 * @param {Matter.IEventCollision<Matter.Engine>} event - 충돌 이벤트
 * @returns {void}
 */
function handleCollisionStart(event) {
  if (isGameOver) {
    return;
  }

  event.pairs.forEach(handleCollisionPair);
}

/**
 * 충돌한 같은 단계 과일의 합체를 예약합니다.
 *
 * @param {Matter.Pair} pair - 충돌 쌍
 * @returns {void}
 */
function handleCollisionPair(pair) {
  const bodyA = pair.bodyA;
  const bodyB = pair.bodyB;

  if (!canMerge(bodyA, bodyB)) {
    return;
  }

  mergingBodyIds.add(bodyA.id);
  mergingBodyIds.add(bodyB.id);

  window.setTimeout(
    mergeFruits.bind(null, bodyA, bodyB),
    0
  );
}

/**
 * 두 Body가 같은 단계의 합체 가능한 과일인지 확인합니다.
 *
 * @param {Matter.Body} bodyA - 첫 번째 Body
 * @param {Matter.Body} bodyB - 두 번째 Body
 * @returns {boolean} 합체 가능 여부
 */
function canMerge(bodyA, bodyB) {
  if (isGameOver) {
    return false;
  }

  if (bodyA.label !== "fruit" || bodyB.label !== "fruit") {
    return false;
  }

  if (
    mergingBodyIds.has(bodyA.id) ||
    mergingBodyIds.has(bodyB.id)
  ) {
    return false;
  }

  const levelA = bodyA.plugin.fruitLevel;
  const levelB = bodyB.plugin.fruitLevel;

  return (
    levelA === levelB &&
    levelA < FRUITS.length - 1
  );
}

/**
 * 같은 단계 과일을 제거하고 다음 단계 과일을 생성합니다.
 * 합체 전 평균 속도와 회전을 새 과일에 이어줍니다.
 *
 * @param {Matter.Body} bodyA - 첫 번째 과일
 * @param {Matter.Body} bodyB - 두 번째 과일
 * @returns {void}
 */
function mergeFruits(bodyA, bodyB) {
  if (isGameOver) {
    mergingBodyIds.delete(bodyA.id);
    mergingBodyIds.delete(bodyB.id);
    return;
  }

  const currentBodyA = Composite.get(engine.world, bodyA.id, "body");
  const currentBodyB = Composite.get(engine.world, bodyB.id, "body");

  if (!currentBodyA || !currentBodyB) {
    mergingBodyIds.delete(bodyA.id);
    mergingBodyIds.delete(bodyB.id);
    return;
  }

  const nextLevel = bodyA.plugin.fruitLevel + 1;
  const nextFruit = FRUITS[nextLevel];
  const centerX = (bodyA.position.x + bodyB.position.x) / 2;
  const centerY = (bodyA.position.y + bodyB.position.y) / 2;
  const clampedX = clampFruitX(centerX, nextLevel);

  const inheritedVelocity = {
    x:
      ((bodyA.velocity.x + bodyB.velocity.x) / 2) *
      MERGE_VELOCITY_RATIO,
    y:
      ((bodyA.velocity.y + bodyB.velocity.y) / 2) *
      MERGE_VELOCITY_RATIO
  };

  const inheritedAngularVelocity = Math.max(
    -MAX_MERGE_ANGULAR_VELOCITY,
    Math.min(
      MAX_MERGE_ANGULAR_VELOCITY,
      ((bodyA.angularVelocity + bodyB.angularVelocity) / 2) *
      MERGE_ANGULAR_VELOCITY_RATIO
    )
  );

  const inheritedAngle = (bodyA.angle + bodyB.angle) / 2;

  Composite.remove(engine.world, bodyA);
  Composite.remove(engine.world, bodyB);

  const mergedFruit = createFruitBody(
    clampedX,
    centerY,
    nextLevel
  );

  Body.setAngle(mergedFruit, inheritedAngle);
  Body.setVelocity(mergedFruit, inheritedVelocity);
  Body.setAngularVelocity(
    mergedFruit,
    inheritedAngularVelocity
  );

  Composite.add(engine.world, mergedFruit);
  addScore(nextFruit.score);

  mergingBodyIds.delete(bodyA.id);
  mergingBodyIds.delete(bodyB.id);
}

/**
 * 게임오버선의 화면 위치를 설정합니다.
 *
 * @returns {void}
 */
function setGameOverLinePosition() {
  gameOverLine.style.top =
    `${(GAME_OVER_LINE_Y / BOARD_HEIGHT) * 100}%`;
}

/**
 * 쌓인 과일 높이를 감시하여 경고선을 표시하고 게임오버를 확정합니다.
 * 새로 떨어지는 과일은 유예시간 동안 판정에서 제외합니다.
 *
 * @returns {void}
 */
function updateGameOverState() {
  if (isGameOver) {
    return;
  }

  const now = performance.now();
  const fruits = Composite
    .allBodies(engine.world)
    .filter((body) => body.label === "fruit");

  const shouldWarn = fruits.some((body) => {
    const age = now - (body.plugin.spawnedAt || now);

    return (
      age >= GAME_OVER_SPAWN_GRACE_TIME &&
      body.bounds.min.y <= GAME_OVER_WARNING_Y &&
      body.speed <= GAME_OVER_MAX_SPEED * 1.5
    );
  });

  gameOverLine.classList.toggle("hidden", !shouldWarn);
  gameContainer.classList.toggle("danger-zone", shouldWarn);

  const dangerousFruit = fruits.find((body) => {
    const age = now - (body.plugin.spawnedAt || now);

    return (
      age >= GAME_OVER_SPAWN_GRACE_TIME &&
      body.bounds.min.y <= GAME_OVER_LINE_Y &&
      body.speed <= GAME_OVER_MAX_SPEED &&
      Math.abs(body.angularSpeed) <=
      GAME_OVER_MAX_ANGULAR_SPEED
    );
  });

  if (!dangerousFruit) {
    dangerStartedAt = null;
    gameOverLine.classList.remove("is-counting");
    return;
  }

  gameOverLine.classList.add("is-counting");

  if (dangerStartedAt === null) {
    dangerStartedAt = now;
    return;
  }

  if (now - dangerStartedAt >= GAME_OVER_HOLD_TIME) {
    endGame();
  }
}

/**
 * 실제 게임오버를 확정하고 입력, 타이머, 물리엔진, 렌더링을 모두 정지합니다.
 *
 * @returns {void}
 */
function endGame() {
  if (isGameOver) {
    return;
  }

  isGameOver = true;
  canDrop = false;
  dangerStartedAt = null;

  clearDropReadyTimer();
  hideAimControls();

  if (activeDragPointerId !== null) {
    releaseDragPointer(activeDragPointerId);
  }

  Runner.stop(runner);
  Render.stop(render);

  gameOverLine.classList.remove("hidden");
  gameOverLine.classList.add("is-counting");
  gameContainer.classList.add("game-over", "danger-zone");

  finalScore.textContent = score;
  gameOverModal.classList.remove("hidden");
}

/**
 * 점수를 더하고 화면을 갱신합니다.
 *
 * @param {number} point - 추가할 점수
 * @returns {void}
 */
function addScore(point) {
  if (isGameOver) {
    return;
  }

  score += point;
  scoreElement.textContent = score;
}

/**
 * 처음 화면으로 돌아가며 게임 상태를 모두 초기화합니다.
 *
 * @returns {void}
 */
function returnToStartScreen() {
  window.location.reload();
}
