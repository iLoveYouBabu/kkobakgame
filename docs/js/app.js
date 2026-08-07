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

const HIGH_SCORE_STORAGE_KEY = "kkobakHighScore";

const SUPABASE_URL = "https://lzhphyellvrprptndpfc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_Lny6VEM72-yxMZbv5xkIbg_aDYyGURZ";
const RANKING_TABLE = "kkobak_rankings";
const RANKING_LIMIT = 50;

const MERGE_POP_DURATION = 240;
const MERGE_POP_START_SCALE = 0.85;
const MERGE_POP_PEAK_SCALE = 1.1;

// 처음 떨어질 수 있는 과일 단계: 0~2
const DROP_LEVEL_MAX = 2;

/*
 * 각 이미지의 투명 영역을 제외한 볼록 외곽선을 정규화한 좌표입니다.
 * 단순화 과정에서도 실제 불투명 픽셀 전체를 감싸도록 바깥으로 보정했습니다.
 */
const FRUITS = [
  {
    "name": "체리꼬",
    "radius": 18,
    "color": "#ff7675",
    "score": 2,
    "image": "./assets/fruits/fruit-1.webp",
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
    "name": "딸기나꼬",
    "radius": 24,
    "color": "#e84393",
    "score": 4,
    "image": "./assets/fruits/fruit-2.webp",
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
    "name": "포도나꼬",
    "radius": 32,
    "color": "#6c5ce7",
    "score": 8,
    "image": "./assets/fruits/fruit-3.webp",
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
    "name": "귤꼬",
    "radius": 42,
    "color": "#fdcb6e",
    "score": 16,
    "image": "./assets/fruits/fruit-4.webp",
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
    "name": "사과꼬",
    "radius": 54,
    "color": "#d63031",
    "score": 32,
    "image": "./assets/fruits/fruit-5.webp",
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
    "name": "배나꼬",
    "radius": 68,
    "color": "#ffeaa7",
    "score": 64,
    "image": "./assets/fruits/fruit-6.webp",
    "imageWidth": 440,
    "imageHeight": 573,
    "centroidX": 0.488027,
    "centroidY": 0.559511,
    "vertices": [
    [
        0.613636,
        0.024433
    ],
    [
        0.654678,
        0.085713
    ],
    [
        0.69572,
        0.146993
    ],
    [
        0.736762,
        0.208273
    ],
    [
        0.777804,
        0.269554
    ],
    [
        0.818845,
        0.330834
    ],
    [
        0.859887,
        0.392114
    ],
    [
        0.900929,
        0.453394
    ],
    [
        0.941824,
        0.514728
    ],
    [
        0.971458,
        0.579678
    ],
    [
        0.985616,
        0.647581
    ],
    [
        0.983298,
        0.716304
    ],
    [
        0.963055,
        0.78319
    ],
    [
        0.922145,
        0.844313
    ],
    [
        0.864083,
        0.89669
    ],
    [
        0.791868,
        0.936805
    ],
    [
        0.710167,
        0.965109
    ],
    [
        0.622908,
        0.980965
    ],
    [
        0.533685,
        0.987784
    ],
    [
        0.444011,
        0.98649
    ],
    [
        0.355118,
        0.977272
    ],
    [
        0.266458,
        0.966621
    ],
    [
        0.180116,
        0.948217
    ],
    [
        0.110118,
        0.91119
    ],
    [
        0.073763,
        0.848277
    ],
    [
        0.039205,
        0.784687
    ],
    [
        0.015815,
        0.718373
    ],
    [
        0.012594,
        0.649655
    ],
    [
        0.027578,
        0.581958
    ],
    [
        0.051294,
        0.5155
    ],
    [
        0.075203,
        0.449082
    ],
    [
        0.099112,
        0.382663
    ],
    [
        0.124095,
        0.316481
    ],
    [
        0.149589,
        0.250411
    ],
    [
        0.175083,
        0.184341
    ],
    [
        0.21109,
        0.121607
    ],
    [
        0.276487,
        0.075345
    ],
    [
        0.360349,
        0.051093
    ],
    [
        0.445666,
        0.029729
    ],
    [
        0.531028,
        0.008498
    ]
  ]
},
  {
    "name": "복숭아꼬",
    "radius": 82,
    "color": "#fab1a0",
    "score": 128,
    "image": "./assets/fruits/fruit-7.webp",
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
    "name": "파인애플꼬",
    "radius": 98,
    "color": "#f9ca24",
    "score": 256,
    "image": "./assets/fruits/fruit-8.webp",
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
    "name": "멜론나꼬",
    "radius": 115,
    "color": "#badc58",
    "score": 512,
    "image": "./assets/fruits/fruit-9.webp",
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
    "name": "똥그래미꼬",
    "radius": 135,
    "color": "#6ab04c",
    "score": 1024,
    "image": "./assets/fruits/fruit-10.webp",
    "imageWidth": 1024,
    "imageHeight": 1515,
    "centroidX": 0.507059,
    "centroidY": 0.523373,
    "vertices": [
    [
        0.07129,
        0.47459
    ],
    [
        0.14844,
        0.32013
    ],
    [
        0.23242,
        0.2132
    ],
    [
        0.33496,
        0.16898
    ],
    [
        0.41406,
        0.16436
    ],
    [
        0.59766,
        0.1967
    ],
    [
        0.84766,
        0.25743
    ],
    [
        0.94336,
        0.41584
    ],
    [
        0.98047,
        0.46535
    ],
    [
        0.98438,
        0.53531
    ],
    [
        0.87891,
        0.73003
    ],
    [
        0.75293,
        0.81056
    ],
    [
        0.60449,
        0.85611
    ],
    [
        0.41895,
        0.86337
    ],
    [
        0.24902,
        0.82838
    ],
    [
        0.1709,
        0.79208
    ],
    [
        0.13477,
        0.73399
    ],
    [
        0.08301,
        0.6264
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
const highScoreElement = document.querySelector("#highScore");
const message = document.querySelector("#message");
const gameContainer = document.querySelector("#gameContainer");
const aimFruit = document.querySelector("#aimFruit");
const dropGuide = document.querySelector("#dropGuide");
const gameOverLine = document.querySelector("#gameOverLine");
const nextFruitList = document.querySelector("#nextFruitList");
const fruitGuideList = document.querySelector("#fruitGuideList");
const fruitGuideButton = document.querySelector("#fruitGuideButton");
const fruitGuideModal = document.querySelector("#fruitGuideModal");
const closeFruitGuideButton = document.querySelector("#closeFruitGuideButton");
const rankingButton = document.querySelector("#rankingButton");
const gameRankingButton = document.querySelector("#gameRankingButton");
const rankingModal = document.querySelector("#rankingModal");
const closeRankingButton = document.querySelector("#closeRankingButton");
const refreshRankingButton = document.querySelector("#refreshRankingButton");
const rankingStatus = document.querySelector("#rankingStatus");
const rankingList = document.querySelector("#rankingList");
const gameOverModal = document.querySelector("#gameOverModal");
const finalScore = document.querySelector("#finalScore");
const finalHighScore = document.querySelector("#finalHighScore");
const newRecordMessage = document.querySelector("#newRecordMessage");
const rankingSubmitMessage = document.querySelector("#rankingSubmitMessage");
const openRankingFromGameOverButton = document.querySelector(
  "#openRankingFromGameOverButton"
);
const closeGameOverButton = document.querySelector("#closeGameOverButton");

let engine = null;
let render = null;
let runner = null;
let score = 0;
let highScore = loadHighScore();
let hasNewHighScore = false;
let currentFruitLevel = 0;
let nextFruitLevels = [];
let aimX = BOARD_WIDTH / 2;
let canDrop = false;
let dropReadyTimer = null;
let activeDragPointerId = null;
let isGameOver = false;
let isStarting = false;
let dangerStartedAt = null;
let rankingReturnFocusElement = null;
let isRankingLoading = false;
let shouldResumeGameAfterRanking = false;

const rankingClient = createRankingClient();

// 같은 과일이 동시에 여러 번 합쳐지는 것을 방지하기 위한 Body ID 목록
const mergingBodyIds = new Set();
const fruitImagesReady = preloadFruitImages();

const savedNickname = localStorage.getItem("kkobakNickname");

if (savedNickname) {
  nicknameInput.value = savedNickname;
}

highScoreElement.textContent = highScore;
renderFruitGuide();

startButton.addEventListener("click", startGame);
nicknameInput.addEventListener("keydown", handleNicknameKeydown);
fruitGuideButton.addEventListener("click", openFruitGuideModal);
closeFruitGuideButton.addEventListener("click", closeFruitGuideModal);
fruitGuideModal.addEventListener("click", handleFruitGuideBackdropClick);
rankingButton.addEventListener("click", openRankingModal);
gameRankingButton.addEventListener("click", openRankingModal);
closeRankingButton.addEventListener("click", closeRankingModal);
refreshRankingButton.addEventListener("click", loadRankings);
rankingModal.addEventListener("click", handleRankingBackdropClick);
openRankingFromGameOverButton.addEventListener(
  "click",
  openRankingModal
);
document.addEventListener("keydown", handleGlobalKeydown);
closeGameOverButton.addEventListener("click", returnToStartScreen);

/**
 * 브라우저용 Supabase 클라이언트를 생성합니다.
 * CDN 로딩에 실패해도 게임 자체는 계속 이용할 수 있습니다.
 *
 * @returns {Object|null} Supabase 클라이언트 또는 null
 */
function createRankingClient() {
  const createClient = window.supabase?.createClient;

  if (typeof createClient !== "function") {
    console.warn("Supabase 라이브러리를 불러오지 못했습니다.");
    return null;
  }

  return createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  );
}

/**
 * 현재 게임에서 사용 중인 닉네임을 반환합니다.
 *
 * @returns {string} 앞뒤 공백을 제거한 닉네임
 */
function getCurrentNickname() {
  return nicknameInput.value.trim();
}

/**
 * 랭킹 모달을 열고 최신 상위 50개 기록을 조회합니다.
 *
 * @returns {void}
 */
function openRankingModal() {
  rankingReturnFocusElement = document.activeElement;

  shouldResumeGameAfterRanking = Boolean(
    engine &&
    runner &&
    !isGameOver &&
    !gameScreen.classList.contains("hidden")
  );

  if (shouldResumeGameAfterRanking) {
    Runner.stop(runner);
  }

  fruitGuideModal.classList.add("hidden");
  rankingModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  closeRankingButton.focus();
  void loadRankings();
}

/**
 * 랭킹 모달을 닫고 열기 전 요소로 포커스를 되돌립니다.
 *
 * @returns {void}
 */
function closeRankingModal() {
  if (rankingModal.classList.contains("hidden")) {
    return;
  }

  rankingModal.classList.add("hidden");

  if (fruitGuideModal.classList.contains("hidden")) {
    document.body.classList.remove("modal-open");
  }

  if (
    shouldResumeGameAfterRanking &&
    engine &&
    runner &&
    !isGameOver
  ) {
    Runner.run(runner, engine);
  }

  shouldResumeGameAfterRanking = false;

  if (
    rankingReturnFocusElement instanceof HTMLElement &&
    document.contains(rankingReturnFocusElement)
  ) {
    rankingReturnFocusElement.focus();
  }
}

/**
 * 랭킹 카드 바깥의 어두운 영역을 누르면 모달을 닫습니다.
 *
 * @param {MouseEvent} event - 모달 클릭 이벤트
 * @returns {void}
 */
function handleRankingBackdropClick(event) {
  if (event.target === rankingModal) {
    closeRankingModal();
  }
}

/**
 * Supabase에서 점수순 상위 50개 기록을 조회합니다.
 * 동점일 때는 최고 점수를 먼저 달성한 기록이 위에 표시됩니다.
 *
 * @returns {Promise<void>} 랭킹 조회 완료 Promise
 */
async function loadRankings() {
  if (isRankingLoading) {
    return;
  }

  if (!rankingClient) {
    rankingStatus.textContent =
      "랭킹 서버에 연결할 수 없습니다.";
    rankingList.replaceChildren();
    return;
  }

  isRankingLoading = true;
  refreshRankingButton.disabled = true;
  rankingStatus.textContent = "랭킹을 불러오는 중입니다.";
  rankingList.setAttribute("aria-busy", "true");

  try {
    const { data, error } = await rankingClient
      .from(RANKING_TABLE)
      .select("nickname, score, achieved_at")
      .order("score", { ascending: false })
      .order("achieved_at", { ascending: true })
      .limit(RANKING_LIMIT);

    if (error) {
      throw error;
    }

    renderRankings(data || []);
  } catch (error) {
    console.error("랭킹 조회 실패:", error);
    rankingStatus.textContent =
      "랭킹을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
    rankingList.replaceChildren();
  } finally {
    isRankingLoading = false;
    refreshRankingButton.disabled = false;
    rankingList.removeAttribute("aria-busy");
  }
}

/**
 * 조회한 랭킹 데이터를 모달 목록에 표시합니다.
 *
 * @param {Array<Object>} rankings - Supabase 랭킹 행 목록
 * @returns {void}
 */
function renderRankings(rankings) {
  if (rankings.length === 0) {
    rankingStatus.textContent = "아직 등록된 기록이 없습니다.";
    rankingList.replaceChildren();
    return;
  }

  const currentNickname = getCurrentNickname();
  const items = rankings.map((ranking, index) => {
    const item = document.createElement("li");
    const rank = document.createElement("span");
    const nickname = document.createElement("strong");
    const scoreValue = document.createElement("span");
    const achievedAt = document.createElement("time");

    item.className = "ranking-item";

    if (ranking.nickname === currentNickname) {
      item.classList.add("is-current-player");
    }

    if (index < 3) {
      item.classList.add(`ranking-top-${index + 1}`);
    }

    rank.className = "ranking-rank";
    rank.textContent = String(index + 1);

    nickname.className = "ranking-nickname";
    nickname.textContent = ranking.nickname;
    nickname.title = ranking.nickname;

    scoreValue.className = "ranking-score";
    scoreValue.textContent = Number(ranking.score).toLocaleString("ko-KR");

    achievedAt.className = "ranking-date";
    achievedAt.dateTime = ranking.achieved_at || "";
    achievedAt.textContent = formatRankingDate(ranking.achieved_at);

    item.append(rank, nickname, scoreValue, achievedAt);
    return item;
  });

  rankingStatus.textContent =
    `상위 ${rankings.length}개의 기록입니다.`;
  rankingList.replaceChildren(...items);
}

/**
 * Supabase의 날짜 문자열을 한국식 날짜로 변환합니다.
 *
 * @param {string|null} value - timestamptz 날짜 문자열
 * @returns {string} 표시용 날짜
 */
function formatRankingDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

/**
 * 게임오버 점수를 Supabase 함수로 제출합니다.
 * DB 함수가 같은 닉네임의 기존 점수보다 높을 때만 갱신합니다.
 *
 * @returns {Promise<void>} 점수 제출 완료 Promise
 */
async function submitRankingScore() {
  const nickname = getCurrentNickname();

  if (!rankingClient) {
    rankingSubmitMessage.textContent =
      "랭킹 서버에 연결하지 못했습니다.";
    rankingSubmitMessage.classList.add("is-error");
    return;
  }

  if (!nickname || score <= 0) {
    rankingSubmitMessage.textContent =
      score <= 0 ? "등록할 점수가 없습니다." : "닉네임을 확인해주세요.";
    return;
  }

  rankingSubmitMessage.classList.remove("is-error", "is-success");
  rankingSubmitMessage.textContent = "랭킹 기록 확인 중...";

  try {
    const { error } = await rankingClient.rpc(
      "submit_kkobak_score",
      {
        p_nickname: nickname,
        p_score: score
      }
    );

    if (error) {
      throw error;
    }

    rankingSubmitMessage.textContent =
      "랭킹 기록을 확인했습니다.";
    rankingSubmitMessage.classList.add("is-success");
  } catch (error) {
    console.error("랭킹 등록 실패:", error);
    rankingSubmitMessage.textContent =
      "랭킹 등록에 실패했습니다. 랭킹 창에서 다시 확인해주세요.";
    rankingSubmitMessage.classList.add("is-error");
  }
}

/**
 * 브라우저에 저장된 최고 점수를 안전하게 불러옵니다.
 *
 * @returns {number} 저장된 최고 점수
 */
function loadHighScore() {
  try {
    const storedScore = Number.parseInt(
      localStorage.getItem(HIGH_SCORE_STORAGE_KEY),
      10
    );

    return Number.isFinite(storedScore) && storedScore > 0
      ? storedScore
      : 0;
  } catch (error) {
    console.warn("최고 점수를 불러오지 못했습니다.", error);
    return 0;
  }
}

/**
 * 현재 최고 점수를 브라우저에 저장합니다.
 * 저장소를 사용할 수 없는 환경에서도 게임은 계속 진행됩니다.
 *
 * @returns {void}
 */
function saveHighScore() {
  try {
    localStorage.setItem(
      HIGH_SCORE_STORAGE_KEY,
      String(highScore)
    );
  } catch (error) {
    console.warn("최고 점수를 저장하지 못했습니다.", error);
  }
}

/**
 * 전체 합체 단계를 이미지와 이름으로 도감에 표시합니다.
 *
 * @returns {void}
 */
function renderFruitGuide() {
  const guideItems = FRUITS.map((fruit, index) => {
    const item = document.createElement("li");
    const level = document.createElement("span");
    const image = document.createElement("img");
    const name = document.createElement("strong");

    item.className = "fruit-guide-item";

    level.className = "fruit-guide-level";
    level.textContent = String(index + 1);

    image.className = "fruit-guide-image";
    image.src = fruit.image;
    image.alt = "";
    image.decoding = "async";

    name.className = "fruit-guide-name";
    name.textContent = fruit.name;

    item.append(level, image, name);
    return item;
  });

  fruitGuideList.replaceChildren(...guideItems);
}

/**
 * 단계 도감 모달을 엽니다.
 *
 * @returns {void}
 */
function openFruitGuideModal() {
  rankingModal.classList.add("hidden");
  fruitGuideModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  closeFruitGuideButton.focus();
}

/**
 * 단계 도감 모달을 닫고 도감 버튼으로 포커스를 되돌립니다.
 *
 * @returns {void}
 */
function closeFruitGuideModal() {
  if (fruitGuideModal.classList.contains("hidden")) {
    return;
  }

  fruitGuideModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  fruitGuideButton.focus();
}

/**
 * 도감 카드 바깥의 어두운 영역을 누르면 모달을 닫습니다.
 *
 * @param {MouseEvent} event - 모달 클릭 이벤트
 * @returns {void}
 */
function handleFruitGuideBackdropClick(event) {
  if (event.target === fruitGuideModal) {
    closeFruitGuideModal();
  }
}

/**
 * 전역 키보드 입력을 처리합니다.
 * 도감이 열린 상태에서 Escape 키를 누르면 모달을 닫습니다.
 *
 * @param {KeyboardEvent} event - 키보드 입력 이벤트
 * @returns {void}
 */
function handleGlobalKeydown(event) {
  if (event.key !== "Escape") {
    return;
  }

  if (!rankingModal.classList.contains("hidden")) {
    closeRankingModal();
    return;
  }

  if (!fruitGuideModal.classList.contains("hidden")) {
    closeFruitGuideModal();
  }
}

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

  if (nickname.length > 50) {
    message.textContent = "닉네임은 50자 이하로 입력해주세요.";
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
  hasNewHighScore = false;
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
      restitution: 0.12,
      friction: 0.04,
      frictionStatic: 0.025,
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
  animateMergedFruit(mergedFruit);
  addScore(nextFruit.score);

  mergingBodyIds.delete(bodyA.id);
  mergingBodyIds.delete(bodyB.id);
}

/**
 * 합체된 과일의 충돌체는 그대로 두고 스프라이트만
 * 0.85 → 1.1 → 1 배율로 짧게 확대·축소합니다.
 *
 * @param {Matter.Body} body - 합체로 생성된 과일 Body
 * @returns {void}
 */
function animateMergedFruit(body) {
  const sprite = body.render?.sprite;

  if (!sprite) {
    return;
  }

  const baseXScale = sprite.xScale;
  const baseYScale = sprite.yScale;
  const startedAt = performance.now();
  const peakPoint = 0.42;

  sprite.xScale = baseXScale * MERGE_POP_START_SCALE;
  sprite.yScale = baseYScale * MERGE_POP_START_SCALE;

  /**
   * 합체 스프라이트의 한 프레임을 갱신합니다.
   *
   * @param {DOMHighResTimeStamp} now - 현재 애니메이션 시각
   * @returns {void}
   */
  function updateMergeScale(now) {
    const currentBody = engine
      ? Composite.get(engine.world, body.id, "body")
      : null;

    if (!currentBody || isGameOver) {
      return;
    }

    const progress = Math.min(
      (now - startedAt) / MERGE_POP_DURATION,
      1
    );

    let scale;

    if (progress <= peakPoint) {
      const sectionProgress = progress / peakPoint;
      const eased = 1 - Math.pow(1 - sectionProgress, 3);

      scale =
        MERGE_POP_START_SCALE +
        (MERGE_POP_PEAK_SCALE - MERGE_POP_START_SCALE) *
          eased;
    } else {
      const sectionProgress =
        (progress - peakPoint) / (1 - peakPoint);
      const eased = 1 - Math.pow(1 - sectionProgress, 3);

      scale =
        MERGE_POP_PEAK_SCALE +
        (1 - MERGE_POP_PEAK_SCALE) * eased;
    }

    sprite.xScale = baseXScale * scale;
    sprite.yScale = baseYScale * scale;

    if (progress < 1) {
      window.requestAnimationFrame(updateMergeScale);
      return;
    }

    sprite.xScale = baseXScale;
    sprite.yScale = baseYScale;
  }

  window.requestAnimationFrame(updateMergeScale);
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

  fruitGuideModal.classList.add("hidden");
  rankingModal.classList.add("hidden");
  document.body.classList.remove("modal-open");

  Runner.stop(runner);
  Render.stop(render);

  gameOverLine.classList.remove("hidden");
  gameOverLine.classList.add("is-counting");
  gameContainer.classList.add("game-over", "danger-zone");

  finalScore.textContent = score;
  finalHighScore.textContent = highScore;
  newRecordMessage.classList.toggle(
    "hidden",
    !hasNewHighScore
  );
  rankingSubmitMessage.textContent = "";
  rankingSubmitMessage.classList.remove("is-error", "is-success");
  gameOverModal.classList.remove("hidden");
  void submitRankingScore();
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

  if (score <= highScore) {
    return;
  }

  highScore = score;
  hasNewHighScore = true;
  highScoreElement.textContent = highScore;
  saveHighScore();
}

/**
 * 처음 화면으로 돌아가며 게임 상태를 모두 초기화합니다.
 *
 * @returns {void}
 */
function returnToStartScreen() {
  shouldResumeGameAfterRanking = false;
  window.location.reload();
}
