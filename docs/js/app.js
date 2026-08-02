const BOARD_WIDTH = 360;
const BOARD_HEIGHT = 600;
const WALL_THICKNESS = 40;
const DROP_COOLDOWN = 450;
const DROP_TOP_MARGIN = 8;
const NEXT_FRUIT_COUNT = 3;

const FRUIT_IMAGE_WIDTH = 1024;
const FRUIT_IMAGE_HEIGHT = 1536;

/*
 * 기존 원형 과일과 면적이 크게 달라지지 않도록
 * 사진형 충돌체의 가로 크기를 반지름 기준으로 계산합니다.
 * 모든 과일 이미지는 1024 × 1536 비율을 기준으로 사용합니다.
 */
const FRUIT_BODY_WIDTH_RATIO = 1.45;
const FRUIT_BODY_HEIGHT_RATIO =
  FRUIT_BODY_WIDTH_RATIO *
  (FRUIT_IMAGE_HEIGHT / FRUIT_IMAGE_WIDTH);

// 처음 떨어질 수 있는 과일 단계: 0~2
const DROP_LEVEL_MAX = 2;

const FRUITS = [
  {
    name: "체리",
    radius: 18,
    color: "#ff7675",
    score: 2,
    image: "./assets/fruits/fruit-1.png"
  },
  {
    name: "딸기",
    radius: 24,
    color: "#e84393",
    score: 4,
    image: "./assets/fruits/fruit-2.png"
  },
  {
    name: "포도",
    radius: 32,
    color: "#6c5ce7",
    score: 8,
    image: "./assets/fruits/fruit-3.png"
  },
  {
    name: "귤",
    radius: 42,
    color: "#fdcb6e",
    score: 16,
    image: "./assets/fruits/fruit-4.png"
  },
  {
    name: "사과",
    radius: 54,
    color: "#d63031",
    score: 32,
    image: "./assets/fruits/fruit-5.png"
  },
  {
    name: "배",
    radius: 68,
    color: "#ffeaa7",
    score: 64,
    image: "./assets/fruits/fruit-6.png"
  },
  {
    name: "복숭아",
    radius: 82,
    color: "#fab1a0",
    score: 128,
    image: "./assets/fruits/fruit-7.png"
  },
  {
    name: "파인애플",
    radius: 98,
    color: "#f9ca24",
    score: 256,
    image: "./assets/fruits/fruit-8.png"
  },
  {
    name: "멜론",
    radius: 115,
    color: "#badc58",
    score: 512,
    image: "./assets/fruits/fruit-9.png"
  },
  {
    name: "수박",
    radius: 135,
    color: "#6ab04c",
    score: 1024,
    image: "./assets/fruits/fruit-10.png"
  }
];

const {
  Engine,
  Render,
  Runner,
  Bodies,
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
const nextFruitList = document.querySelector("#nextFruitList");
const testGameOverButton = document.querySelector("#testGameOverButton");
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

// 같은 과일이 동시에 여러 번 합쳐지는 것을 방지하기 위한 Body ID 목록
const mergingBodyIds = new Set();

const savedNickname = localStorage.getItem("kkobakNickname");

if (savedNickname) {
  nicknameInput.value = savedNickname;
}

startButton.addEventListener("click", startGame);
nicknameInput.addEventListener("keydown", handleNicknameKeydown);
testGameOverButton.addEventListener("click", showTestGameOver);
closeGameOverButton.addEventListener("click", returnToStartScreen);

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
 * 닉네임을 검사하고 게임 화면을 표시합니다.
 * 입력한 닉네임은 브라우저의 localStorage에 저장합니다.
 *
 * @returns {void}
 */
function startGame() {
  const nickname = nicknameInput.value.trim();

  if (!nickname) {
    message.textContent = "닉네임을 입력해주세요.";
    nicknameInput.focus();
    return;
  }

  message.textContent = "";
  playerName.textContent = `${nickname}님`;

  loginScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  localStorage.setItem("kkobakNickname", nickname);

  initializeGame();
}

/**
 * Matter.js 물리엔진과 게임판을 생성합니다.
 * 이미 게임판이 생성된 상태라면 게임만 초기화합니다.
 *
 * @returns {void}
 */
function initializeGame() {
  if (engine) {
    resetGame();
    return;
  }

  engine = Engine.create();
  engine.gravity.x = 0;
  engine.gravity.y = 1;

  render = Render.create({
    element: gameContainer,
    engine,
    options: {
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      wireframes: false,
      background: "#fffaf0"
    }
  });

  /*
   * 고해상도 모바일과 레티나 화면에서
   * 캔버스 및 이미지가 흐려지는 현상을 줄입니다.
   */
  Render.setPixelRatio(
    render,
    Math.min(window.devicePixelRatio || 1, 3)
  );

  runner = Runner.create();

  createWalls();
  registerCollisionEvent();
  registerBoardPointerEvents();

  Render.run(render);
  Runner.run(runner, engine);

  prepareFirstFruit();
}

/**
 * 게임판의 왼쪽 벽, 오른쪽 벽, 바닥을 생성합니다.
 * 벽과 바닥은 움직이지 않는 정적 물체로 생성됩니다.
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

  Composite.add(engine.world, [
    floor,
    leftWall,
    rightWall
  ]);
}

/**
 * 게임판의 마우스 및 터치 이벤트를 등록합니다.
 * PC에서는 마우스 이동 후 클릭하면 과일을 떨어뜨리고,
 * 모바일에서는 누른 채 드래그한 뒤 손을 떼면 과일을 떨어뜨립니다.
 *
 * @returns {void}
 */
function registerBoardPointerEvents() {
  render.canvas.addEventListener(
    "pointermove",
    handleBoardPointerMove
  );

  render.canvas.addEventListener(
    "pointerdown",
    handleBoardPointerDown
  );

  render.canvas.addEventListener(
    "pointerup",
    handleBoardPointerUp
  );

  render.canvas.addEventListener(
    "pointercancel",
    handleBoardPointerCancel
  );
}

/**
 * 게임판 위에서 포인터가 움직이면 대기 과일의 가로 위치를 변경합니다.
 * 마우스는 항상 위치를 따라가고, 터치와 펜은 드래그 중일 때만 이동합니다.
 *
 * @param {PointerEvent} event - 마우스, 터치 또는 펜 이동 이벤트
 * @returns {void}
 */
function handleBoardPointerMove(event) {
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
 * 게임판에서 포인터 입력이 시작되었을 때 조작 방식을 구분합니다.
 * 마우스는 누른 위치에서 즉시 과일을 떨어뜨리고,
 * 터치와 펜은 드래그를 시작해 손을 뗄 때까지 낙하를 보류합니다.
 *
 * @param {PointerEvent} event - 마우스, 터치 또는 펜 입력 시작 이벤트
 * @returns {void}
 */
function handleBoardPointerDown(event) {
  if (!event.isPrimary || !canDrop) {
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
 * 모바일 드래그가 끝나 손가락이나 펜을 떼면 현재 위치에 과일을 떨어뜨립니다.
 * 마우스는 pointerdown에서 이미 낙하하므로 이 함수에서 처리하지 않습니다.
 *
 * @param {PointerEvent} event - 터치 또는 펜 입력 종료 이벤트
 * @returns {void}
 */
function handleBoardPointerUp(event) {
  if (
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
 * 브라우저나 운영체제에 의해 모바일 드래그가 취소되면 낙하하지 않고 상태만 정리합니다.
 *
 * @param {PointerEvent} event - 취소된 터치 또는 펜 이벤트
 * @returns {void}
 */
function handleBoardPointerCancel(event) {
  if (event.pointerId !== activeDragPointerId) {
    return;
  }

  releaseDragPointer(event.pointerId);
}

/**
 * 활성 드래그 포인터의 캡처를 해제하고 드래그 상태를 초기화합니다.
 *
 * @param {number} pointerId - 해제할 포인터 ID
 * @returns {void}
 */
function releaseDragPointer(pointerId) {
  if (render.canvas.hasPointerCapture(pointerId)) {
    render.canvas.releasePointerCapture(pointerId);
  }

  activeDragPointerId = null;
}

/**
 * 포인터의 화면 좌표를 Matter.js 게임판 좌표로 변환하고,
 * 현재 과일이 좌우 벽을 벗어나지 않는 범위로 보정합니다.
 *
 * @param {PointerEvent} event - 좌표를 가져올 포인터 이벤트
 * @returns {void}
 */
function updateAimPosition(event) {
  const clickedX = getBoardXFromPointer(event);

  aimX = clampFruitX(
    clickedX,
    currentFruitLevel
  );

  updateAimPreviewPosition();
}

/**
 * 포인터의 화면상 가로 좌표를 360px 기준 게임판 좌표로 변환합니다.
 *
 * @param {PointerEvent} event - 좌표를 가져올 포인터 이벤트
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
 * 과일 단계에 따른 실제 충돌 몸체의 크기를 반환합니다.
 * 이미지 과일은 원본 이미지의 2:3 비율을 유지하고,
 * 이미지가 없는 과일은 기존 원형 크기를 사용합니다.
 *
 * @param {number} level - 크기를 계산할 과일 단계
 * @returns {{width: number, height: number}} 과일 몸체의 가로 및 세로 크기
 */
function getFruitBodySize(level) {
  const fruit = FRUITS[level];

  if (fruit.image) {
    return {
      width: fruit.radius * FRUIT_BODY_WIDTH_RATIO,
      height: fruit.radius * FRUIT_BODY_HEIGHT_RATIO
    };
  }

  return {
    width: fruit.radius * 2,
    height: fruit.radius * 2
  };
}

/**
 * 과일의 실제 가로 크기를 기준으로
 * 가로 좌표를 게임판 내부로 제한합니다.
 *
 * @param {number} x - 보정할 게임판 가로 좌표
 * @param {number} level - 위치를 계산할 과일 단계
 * @returns {number} 좌우 벽 안쪽으로 보정된 가로 좌표
 */
function clampFruitX(x, level) {
  const { width } = getFruitBodySize(level);
  const halfWidth = width / 2;
  const minX = halfWidth + 4;
  const maxX = BOARD_WIDTH - halfWidth - 4;

  return Math.max(
    minX,
    Math.min(maxX, x)
  );
}

/**
 * 첫 번째 현재 과일과 다음 과일 3개를 무작위로 준비합니다.
 * 대기 과일은 게임판 중앙에서 시작합니다.
 *
 * @returns {void}
 */
function prepareFirstFruit() {
  currentFruitLevel = getRandomDropLevel();
  nextFruitLevels = Array.from(
    { length: NEXT_FRUIT_COUNT },
    getRandomDropLevel
  );
  aimX = clampFruitX(
    BOARD_WIDTH / 2,
    currentFruitLevel
  );
  canDrop = true;

  updateAimPreview();
  updateNextFruitList();
  showAimControls();
}

/**
 * 다음 과일 목록의 첫 항목을 현재 과일로 넘기고 새 과일을 목록 끝에 추가합니다.
 *
 * @returns {void}
 */
function advanceFruitQueue() {
  currentFruitLevel = nextFruitLevels.shift();
  nextFruitLevels.push(getRandomDropLevel());
  aimX = clampFruitX(
    aimX,
    currentFruitLevel
  );

  updateAimPreview();
  updateNextFruitList();
}

/**
 * 처음 떨어질 과일의 단계를 무작위로 결정합니다.
 * 현재는 0단계부터 DROP_LEVEL_MAX 단계까지 등장합니다.
 *
 * @returns {number} 무작위로 결정된 과일 단계
 */
function getRandomDropLevel() {
  return Math.floor(
    Math.random() * (DROP_LEVEL_MAX + 1)
  );
}

/**
 * 현재 대기 중인 과일을 Matter.js 월드에 추가합니다.
 * 낙하 직후에는 짧은 시간 동안 추가 입력을 막습니다.
 *
 * @returns {void}
 */
function dropCurrentFruit() {
  if (!canDrop) {
    return;
  }

  canDrop = false;
  hideAimControls();

  const { height } =
    getFruitBodySize(currentFruitLevel);

  const body = createFruitBody(
    aimX,
    height / 2 + DROP_TOP_MARGIN,
    currentFruitLevel
  );

  Composite.add(engine.world, body);

  scheduleNextDrop();
}

/**
 * 낙하 쿨다운이 끝난 뒤 과일 순서를 한 칸 넘기고,
 * 다음 과일을 조작할 수 있도록 입력과 대기 표시를 동시에 활성화합니다.
 *
 * @returns {void}
 */
function scheduleNextDrop() {
  clearDropReadyTimer();

  dropReadyTimer = window.setTimeout(() => {
    advanceFruitQueue();
    canDrop = true;
    showAimControls();
    dropReadyTimer = null;
  }, DROP_COOLDOWN);
}

/**
 * 등록된 낙하 준비 타이머가 있으면 취소하고 참조를 비웁니다.
 *
 * @returns {void}
 */
function clearDropReadyTimer() {
  if (dropReadyTimer === null) {
    return;
  }

  window.clearTimeout(dropReadyTimer);
  dropReadyTimer = null;
}

/**
 * 현재 과일의 크기와 색상을 대기 과일 표시 요소에 반영합니다.
 *
 * @returns {void}
 */
function updateAimPreview() {
  const fruit = FRUITS[currentFruitLevel];
  const { width } =
    getFruitBodySize(currentFruitLevel);

  const widthPercent = (
    width /
    BOARD_WIDTH
  ) * 100;

  aimFruit.style.width = `${widthPercent}%`;
  aimFruit.title = fruit.name;

  applyFruitPreviewStyle(aimFruit, fruit);
  updateAimPreviewPosition();
}

/**
 * 현재 aimX 좌표를 기준으로 대기 과일과 낙하 안내선의 위치를 갱신합니다.
 *
 * @returns {void}
 */
function updateAimPreviewPosition() {
  const leftPercent = (
    aimX /
    BOARD_WIDTH
  ) * 100;

  aimFruit.style.left = `${leftPercent}%`;
  dropGuide.style.left = `${leftPercent}%`;
}

/**
 * 다음에 등장할 과일 3개를 순서대로 목록에 표시합니다.
 * 첫 번째 항목이 현재 과일 다음에 바로 등장할 과일입니다.
 *
 * @returns {void}
 */
function updateNextFruitList() {
  const listItems = nextFruitLevels.map(
    createNextFruitListItem
  );

  nextFruitList.replaceChildren(...listItems);
}

/**
 * 다음 과일 목록에 표시할 한 개의 항목을 생성합니다.
 *
 * @param {number} level - 표시할 과일 단계
 * @param {number} index - 다음 과일 목록의 순서
 * @returns {HTMLLIElement} 생성된 다음 과일 목록 항목
 */
function createNextFruitListItem(level, index) {
  const fruit = FRUITS[level];
  const item = document.createElement("li");
  const order = document.createElement("span");
  const preview = document.createElement("span");
  const name = document.createElement("strong");
  const { width } = getFruitBodySize(level);
  const previewSize = Math.min(
    28 + width * 0.4,
    46
  );

  item.className = "next-fruit-item";
  item.setAttribute(
    "aria-label",
    `${index + 1}번째 다음 과일 ${fruit.name}`
  );

  order.className = "next-fruit-order";
  order.textContent = String(index + 1);

  preview.className = "next-fruit-preview";
  preview.style.width = `${previewSize}px`;
  preview.title = fruit.name;
  preview.setAttribute("aria-hidden", "true");

  applyFruitPreviewStyle(preview, fruit);

  name.className = "next-fruit-name";
  name.textContent = fruit.name;

  item.append(order, preview, name);

  return item;
}

/**
 * 과일 데이터에 이미지가 있으면 이미지 미리보기를 적용하고,
 * 이미지가 없으면 기존 색상 원형 미리보기를 적용합니다.
 *
 * @param {HTMLElement} element - 미리보기를 표시할 HTML 요소
 * @param {Object} fruit - 표시할 과일 데이터
 * @returns {void}
 */
function applyFruitPreviewStyle(element, fruit) {
  if (fruit.image) {
    element.style.aspectRatio =
      `${FRUIT_IMAGE_WIDTH} / ${FRUIT_IMAGE_HEIGHT}`;
    element.style.backgroundImage = `url("${fruit.image}")`;
    element.style.backgroundColor = "transparent";
    element.style.backgroundPosition = "center";
    element.style.backgroundRepeat = "no-repeat";
    element.style.backgroundSize = "contain";
    element.style.border = "0";
    element.style.borderRadius = "0";
    element.style.boxShadow = "none";
    return;
  }

  element.style.aspectRatio = "1";
  element.style.backgroundImage = "none";
  element.style.backgroundColor = fruit.color;
  element.style.backgroundPosition = "center";
  element.style.backgroundRepeat = "no-repeat";
  element.style.backgroundSize = "contain";
  element.style.border = "2px solid #333";
  element.style.borderRadius = "50%";
  element.style.boxShadow = "inset 0 -4px 0 rgb(0 0 0 / 8%)";
}

/**
 * 대기 과일과 낙하 위치 안내선을 화면에 표시합니다.
 *
 * @returns {void}
 */
function showAimControls() {
  aimFruit.classList.remove("hidden");
  dropGuide.classList.remove("hidden");
}

/**
 * 과일이 떨어지는 동안 대기 과일과 낙하 위치 안내선을 숨깁니다.
 *
 * @returns {void}
 */
function hideAimControls() {
  aimFruit.classList.add("hidden");
  dropGuide.classList.add("hidden");
}

/**
 * Matter.js에서 사용할 과일 Body를 생성합니다.
 * 이미지 과일은 이미지 비율의 둥근 사각형으로,
 * 이미지가 없는 과일은 원형으로 생성합니다.
 *
 * @param {number} x - 과일의 가로 위치
 * @param {number} y - 과일의 세로 위치
 * @param {number} level - 과일 단계
 * @returns {Matter.Body} 생성된 과일 Body
 */
function createFruitBody(x, y, level) {
  const fruit = FRUITS[level];
  const { width, height } =
    getFruitBodySize(level);

  const bodyOptions = {
    label: "fruit",
    restitution: 0.15,
    friction: 0.03,
    frictionStatic: 0.1,
    frictionAir: 0.001,
    plugin: {
      fruitLevel: level
    }
  };

  if (fruit.image) {
    bodyOptions.render = {
      sprite: {
        texture: fruit.image,
        xScale: width / FRUIT_IMAGE_WIDTH,
        yScale: height / FRUIT_IMAGE_HEIGHT
      }
    };

    return Bodies.rectangle(
      x,
      y,
      width,
      height,
      {
        ...bodyOptions,
        chamfer: {
          radius:
            Math.min(width, height) * 0.22
        }
      }
    );
  }

  return Bodies.circle(
    x,
    y,
    fruit.radius,
    {
      ...bodyOptions,
      render: {
        fillStyle: fruit.color,
        strokeStyle: "#333",
        lineWidth: 2
      }
    }
  );
}

/**
 * Matter.js의 충돌 시작 이벤트를 등록합니다.
 *
 * @returns {void}
 */
function registerCollisionEvent() {
  Events.on(
    engine,
    "collisionStart",
    handleCollisionStart
  );
}

/**
 * 물체 충돌이 시작되었을 때 발생한 모든 충돌 쌍을 확인합니다.
 *
 * @param {Matter.IEventCollision<Matter.Engine>} event - Matter.js 충돌 이벤트
 * @returns {void}
 */
function handleCollisionStart(event) {
  event.pairs.forEach(handleCollisionPair);
}

/**
 * 충돌한 두 물체가 합체할 수 있는지 확인하고 합체를 예약합니다.
 *
 * @param {Matter.Pair} pair - 충돌한 두 물체의 정보
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

  // 충돌 이벤트 처리 중 Body를 바로 삭제하지 않고,
  // 현재 충돌 처리가 끝난 다음 합체하도록 예약합니다.
  setTimeout(
    mergeFruits.bind(null, bodyA, bodyB),
    0
  );
}

/**
 * 충돌한 두 물체가 합체 가능한 같은 단계의 과일인지 확인합니다.
 *
 * @param {Matter.Body} bodyA - 첫 번째 충돌 물체
 * @param {Matter.Body} bodyB - 두 번째 충돌 물체
 * @returns {boolean} 합체할 수 있으면 true, 아니면 false
 */
function canMerge(bodyA, bodyB) {
  if (
    bodyA.label !== "fruit" ||
    bodyB.label !== "fruit"
  ) {
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

  if (levelA !== levelB) {
    return false;
  }

  // 마지막 단계인 수박끼리는 더 이상 합쳐지지 않습니다.
  if (levelA >= FRUITS.length - 1) {
    return false;
  }

  return true;
}

/**
 * 같은 단계의 과일 두 개를 제거하고,
 * 두 과일의 중앙 위치에 다음 단계 과일을 생성합니다.
 *
 * @param {Matter.Body} bodyA - 합체할 첫 번째 과일
 * @param {Matter.Body} bodyB - 합체할 두 번째 과일
 * @returns {void}
 */
function mergeFruits(bodyA, bodyB) {
  const currentBodyA = Composite.get(
    engine.world,
    bodyA.id,
    "body"
  );

  const currentBodyB = Composite.get(
    engine.world,
    bodyB.id,
    "body"
  );

  // 합체 전에 과일이 이미 제거된 경우 처리를 중단합니다.
  if (!currentBodyA || !currentBodyB) {
    mergingBodyIds.delete(bodyA.id);
    mergingBodyIds.delete(bodyB.id);
    return;
  }

  const currentLevel = bodyA.plugin.fruitLevel;
  const nextLevel = currentLevel + 1;
  const nextFruit = FRUITS[nextLevel];

  const centerX = (
    bodyA.position.x +
    bodyB.position.x
  ) / 2;

  const centerY = (
    bodyA.position.y +
    bodyB.position.y
  ) / 2;

  // 커진 과일이 게임판의 좌우 벽을 뚫지 않도록 위치를 보정합니다.
  const clampedX = clampFruitX(
    centerX,
    nextLevel
  );

  Composite.remove(engine.world, bodyA);
  Composite.remove(engine.world, bodyB);

  const mergedFruit = createFruitBody(
    clampedX,
    centerY,
    nextLevel
  );

  Composite.add(engine.world, mergedFruit);

  addScore(nextFruit.score);
  mergingBodyIds.delete(bodyA.id);
  mergingBodyIds.delete(bodyB.id);
}

/**
 * 현재 점수에 전달받은 점수를 더하고 화면을 갱신합니다.
 *
 * @param {number} point - 추가할 점수
 * @returns {void}
 */
function addScore(point) {
  score += point;
  scoreElement.textContent = score;
}

/**
 * Matter.js Body가 움직이는 동적 물체인지 확인합니다.
 *
 * @param {Matter.Body} body - 확인할 Matter.js Body
 * @returns {boolean} 동적 물체이면 true, 정적 물체이면 false
 */
function isDynamicBody(body) {
  return !body.isStatic;
}

/**
 * Matter.js 월드에서 전달받은 물체를 제거합니다.
 *
 * @param {Matter.Body} body - 제거할 Matter.js Body
 * @returns {void}
 */
function removeBodyFromWorld(body) {
  Composite.remove(engine.world, body);
}

/**
 * 게임판에 생성된 모든 과일을 제거하고 점수 및 과일 순서를 초기화합니다.
 * 벽과 바닥 같은 정적 물체는 유지합니다.
 *
 * @returns {void}
 */
function resetGame() {
  if (!engine) {
    return;
  }

  clearDropReadyTimer();
  activeDragPointerId = null;

  const dynamicBodies = Composite
    .allBodies(engine.world)
    .filter(isDynamicBody);

  dynamicBodies.forEach(removeBodyFromWorld);

  mergingBodyIds.clear();
  score = 0;
  scoreElement.textContent = score;
  message.textContent = "";

  prepareFirstFruit();
}


/**
 * 테스트용 게임오버 화면을 표시합니다.
 * 현재 점수를 최종 점수로 출력하고 게임판 입력을 차단합니다.
 *
 * @returns {void}
 */
function showTestGameOver() {
  finalScore.textContent = score;

  gameContainer.classList.add("game-over");
  gameOverModal.classList.remove("hidden");
}

/**
 * 게임오버 화면에서 처음 화면으로 돌아갑니다.
 * 페이지를 새로고침하여 게임 상태와 점수를 모두 초기화합니다.
 * 저장된 닉네임은 localStorage에 남아 입력창에 다시 표시됩니다.
 *
 * @returns {void}
 */
function returnToStartScreen() {
  window.location.reload();
}
