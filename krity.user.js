// ==UserScript==
// @name         krity
// @version      3
// @description  yes
// @author       yes
// @match        *survev.io*
// @run-at       document-start
// @icon         https://i.postimg.cc/W4g7cxLP/image.png
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const pixiScript = document.createElement('script');
    pixiScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.0.3/pixi.min.js';
    document.head.appendChild(pixiScript);

    setTimeout(() => {
        console.log("Delayed for 1 second.");
    }, 1000);

    const GREEN = 0x00ff00;
    const BLUE = 0x005555ff;
    const RED = 0xff0000;
    const WHITE = 0xffffff;
    const version = '1.2.0';

    const newFeaturesKey = `newFeaturesShown_${version}`;
    const newFeaturesShown = localStorage.getItem(newFeaturesKey) || false;

    if (!newFeaturesShown) {

      const message = `
        <strong style="font-size:20px;display:block;">Updates in NOVAMod:</strong><br>
        - major GUI changes<br>
        - better aimbot targetting system<br>
        - fixed performance issues regarding explosions<br>
        - <br>`
      ;

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '50%';
        overlay.style.left = '10px';
        overlay.style.transform = 'translateY(-50%)';
        overlay.style.width = '220px';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        overlay.style.padding = '15px';
        overlay.style.zIndex = '999';
        overlay.style.fontSize = '14px';
        overlay.style.color = '#fff';
        overlay.style.fontFamily = 'Arial, sans-serif';

        const notification = document.createElement('div');
        notification.innerHTML = message;
        notification.style.position = 'fixed';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.backgroundColor = 'rgb(20, 20, 20)';
        notification.style.color = '#fff';
        notification.style.padding = '20px';
        notification.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        notification.style.zIndex = '1000';
        notification.style.borderRadius = '10px';
        notification.style.maxWidth = '500px';
        notification.style.width = '80%';
        notification.style.textAlign = 'center';
        notification.style.fontSize = '17px';
        notification.style.overflow = 'auto';
        notification.style.maxHeight = '90%';
        notification.style.margin = '10px';


        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.margin = '20px auto 0 auto';
        closeButton.style.padding = '10px 20px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#007bff';
        closeButton.style.color = '#fff';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.display = 'block';

        closeButton.addEventListener('click', () => {
            document.body.removeChild(notification);
            document.body.removeChild(overlay);
            localStorage.setItem(newFeaturesKey, true);
        });

        notification.appendChild(closeButton);
        document.body.appendChild(overlay);
        document.body.appendChild(notification);
    }

    const moduleList = document.createElement('div');

    const nameOverlay = document.createElement('div');
    nameOverlay.className = 'NOVA-overlay';
    nameOverlay.style.position = 'fixed';
    nameOverlay.style.top = '8px';
    nameOverlay.style.left = '250px';
    nameOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
    nameOverlay.style.padding = '10px';
    nameOverlay.style.color = '#fff';
    nameOverlay.style.zIndex = '9999';
    nameOverlay.style.borderRadius = '5px';
    nameOverlay.style.fontFamily = 'Arial, sans-serif';
    nameOverlay.style.minWidth = '200px';

    const title = document.createElement('div');
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';
    title.style.textAlign = 'center';
    title.style.textShadow = '3px 3px 10px black';
    title.textContent = 'NOVA v1.2';
    let state = {
        get aimAtKnockedOutStatus() {
            return this.isAimAtKnockedOutEnabled;
        },
        get meleeStatus() {
            return this.isMeleeAttackEnabled;
        },
        focusedEnemy: null,
        get focusedEnemyStatus() {
            return this.focusedEnemy;
        },
        isAimAtKnockedOutEnabled: true,
        isZoomEnabled: true,
        isMeleeAttackEnabled: true,
        isSpinBotEnabled: false,
        isAutoSwitchEnabled: false,
        isUseOneGunEnabled: false,
        isXrayEnabled: true,
        friends: [],
        lastFrames: {},
        enemyAimBot: null,
        isLaserDrawerEnabled: true,
        isLineDrawerEnabled: true,
        isNadeDrawerEnabled: true,
        isOverlayEnabled: true,
        isModuleListEnabled: false,
        isFollowBotEnabled: false,
        meleeRange: 8,
        isPanHeroEnabled: false,
        isAimBotEnabled: true,
};

    function getTeam(player) {
        return Object.keys(game.playerBarn.teamInfo).find(team => game.playerBarn.teamInfo[team].playerIds.includes(player.__id));
    }

    function findWeap(player) {
        const weapType = player.netData.activeWeapon;
        return weapType && window.guns[weapType] ? window.guns[weapType] : null;
    }

    function findBullet(weapon) {
        return weapon ? window.bullets[weapon.bulletType] : null;
    }

    const overlay = document.createElement('div');
    overlay.className = 'NOVA-overlay';
    const aimbotDot = document.createElement("div");
    aimbotDot.className = "aimbotMarker-broken";


    const NOVATitle = document.createElement('h3');
    NOVATitle.className = 'NOVA-title';

    function updateModuleList() {

        moduleList.innerHTML = '';
        moduleList.className = 'NOVA-module-list';
        moduleList.style.top = '29px';
        moduleList.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
        moduleList.style.borderRadius = '10px';
        moduleList.style.border = "2px solid #0000FF";
        moduleList.style.transform = "translate(0px, 8px)";
        moduleList.style.padding = "10px 10px";

       let controls = [
           [ '[B] Aimbot', state.isAimBotEnabled, state.isAimBotEnabled ? 'ON' : 'OFF' ],
           [ '[J] Aim at Downed', state.isAimAtKnockedOutEnabled, state.isAimAtKnockedOutEnabled ? 'ON' : 'OFF' ],
           [ '[H] Auto Quick-switch', qs, qs ? 'ON' : 'OFF' ],
           [ '[U] Player Names', vn, vn ? 'ON' : 'OFF' ],
           [ '[Y] Spinbot', state.isSpinBotEnabled, state.isSpinBotEnabled ? 'ON' : 'OFF' ],
           [ '[P] Spread Cone', state.isLaserDrawerEnabled, state.isLaserDrawerEnabled ? 'ON' : 'OFF' ],
           [ '[K] Tracers', state.isLineDrawerEnabled, state.isLineDrawerEnabled ? 'ON' : 'OFF' ],
           [ '[N] Use One Gun', state.isUseOneGunEnabled, state.isUseOneGunEnabled ? 'ON' : 'OFF' ],
           [ '[O] X-ray', state.isObstacleTransparent, state.isObstacleTransparent ? 'ON' : 'OFF' ],
           [ '[Z] Zoom', state.isZoomEnabled, state.isZoomEnabled ? 'ON' : 'OFF' ],
           [ '[X] Melee Attack', state.isMeleeAttackEnabled, state.isMeleeAttackEnabled ? 'ON' : 'OFF' ],
           [ '[L] Follow Bot', state.isFollowBotEnabled, state.isFollowBotEnabled ? "ON" : "OFF"],
           [ '[E] Pan Hero', state.isPanHeroEnabled, state.isPanHeroEnabled ? 'ON' : 'OFF' ],
       ];


        controls.forEach((control, index) => {
            let [name, isEnabled, optionalText] = control;
            const text = `${name} ${optionalText}`;

            const line = document.createElement('p');
            line.className = 'NOVA-control';
            line.style.color = "#FFFFFF";
            line.style.fontFamily = '"Trebuchet MS", sans-serif';
            line.style.opacity = isEnabled ? 1 : 0.5;
            line.style.marginBottom = (index === controls.length - 1) ? '0px' : '3px';
            line.style.transform = "translate(0px, -4px)";
            line.style.textAlign = 'left';
            line.style.textShadow = '3px 3px 5px black';
            line.style.fontSize = '15px';

            line.textContent = text;

            moduleList.appendChild(line);
        });
    }


    function updateOverlay() {
        overlay.innerHTML = ``;
        overlay.appendChild(title);
        updateModuleList();
    }

    function toggleModuleList(){
    }


    function toggleOverlay(){
    }

    document.querySelector('#ui-game').append(overlay);
    document.querySelector('#ui-top-left').insertBefore(NOVATitle, document.querySelector('#ui-top-left').firstChild);

    function meleeAttackToggle() {
        state.isMeleeAttackEnabled = !state.isMeleeAttackEnabled;
        console.log(`Melee Attack: ${state.isMeleeAttackEnabled ? "Enabled" : "Disabled"}`);
        if (!state.isMeleeAttackEnabled) {
            window.aimTouchMoveDir = null;
        }
        updateOverlay();
        updateButtonColors();
}


    state.isAimBotEnabled = true;
    state.focusedEnemy = true;

    /*
    MATHEMATICAL DERIVATION:
    Target is now at (X1,Y1)
    Target velocity is given by v⃗_T
    Projectile is initially at (0,0)
    projectile speed is v_P (|v⃗_P|=v_P)

    intercept point = (X1,Y1)+(v⃗_T)*t = (0,0)+(v⃗_P)*t
        two unknowns: v⃗_P and t
    Use the distance relationship to disregard vector direction
    -> |(X1,Y1)+(v⃗_T)*t| = |(0,0)+(v⃗_P)*t|2 interpretations of the same point
    -> (X1+t*Vx)^2+(Y1+t*Vy)^2 = (v_P)^2*t^2Use squared distance for convenience
    -> (X1^2+Y1^2) +t^2*(Vx^2+Vy^2-v_P^2) +2*t*(X1*Vx+Y1*Vy) = 0
    now we can solve for t
    substitute t in (X1,Y1)+(v⃗_T)*t to obtain interception point P
    scale the OP vector to length of v_P, now we have the projectile velocity vector
    */
    document.querySelector("#ui-game").append(aimbotDot);

    function get_pred_pos(X1, Y1, v_X, v_Y, v_P){
        var C=X1*X1+Y1*Y1, B=2*(X1*v_X+Y1*v_Y), A=v_X*v_X+v_Y*v_Y-v_P*v_P;
        var det=B*B-4*A*C;
        if(det<0)return {x:0, y:0};
        var t_sol1=(-B+Math.sqrt(det))/(2*A), t_sol2=(-B-Math.sqrt(det))/(2*A);
        var t_mn=Math.min(t_sol1), t_mx=Math.min(t_sol2);
        if(t_mx<0)return {x:0, y:0};
        var t_opt = (t_mn<0)?t_mx: t_mn;
        return {x:X1+v_X*t_opt, y:Y1+v_Y*t_opt};
    }
    function calculatePredictedPosForShoot(enemy, curPlayer) {
  if (!enemy || !curPlayer) {
    console.log("Missing enemy or player data");
    return null;
  }

  const { pos: enemyPos } = enemy;
  const { pos: curPlayerPos } = curPlayer;

  const dateNow = performance.now();

  if (!(enemy.__id in state.lastFrames)) state.lastFrames[enemy.__id] = [];
  state.lastFrames[enemy.__id].push([dateNow, { ...enemyPos }]);

  if (state.lastFrames[enemy.__id].length < 30) {
    console.log("Insufficient data for prediction, using current position");
    return window.game.camera.pointToScreen({
      x: enemyPos._x,
      y: enemyPos._y,
    });
  }

  if (state.lastFrames[enemy.__id].length > 30) {
    state.lastFrames[enemy.__id].shift();
  }

  const deltaTime = (dateNow - state.lastFrames[enemy.__id][0][0]) / 1000; 

  const enemyVelocity = {
    x: (enemyPos._x - state.lastFrames[enemy.__id][0][1]._x) / deltaTime,
    y: (enemyPos._y - state.lastFrames[enemy.__id][0][1]._y) / deltaTime,
  };

  const weapon = findWeap(curPlayer);
  const bullet = findBullet(weapon);

  let bulletSpeed;
  if (!bullet) {
    bulletSpeed = 1000;
  } else {
    bulletSpeed = bullet.speed;
  }
  const vex = enemyVelocity.x;
  const vey = enemyVelocity.y;
  const dx = enemyPos._x - curPlayerPos._x;
  const dy = enemyPos._y - curPlayerPos._y;
  const vb = bulletSpeed;

  const a = vb ** 2 - vex ** 2 - vey ** 2;
  const b = -2 * (vex * dx + vey * dy);
  const c = -(dx ** 2) - (dy ** 2);

  let t;

  if (Math.abs(a) < 1e-6) {
    console.log("Linear solution bullet speed is much greater than velocity");
    t = -c / b;
  } else {
    const discriminant = b ** 2 - 4 * a * c;

    if (discriminant < 0) {
      console.log("No solution, shooting at current position");
      return window.game.camera.pointToScreen({
        x: enemyPos._x,
        y: enemyPos._y,
      });
    }

    const sqrtD = Math.sqrt(discriminant);
    const t1 = (-b - sqrtD) / (2 * a);
    const t2 = (-b + sqrtD) / (2 * a);

    t = Math.min(t1, t2) > 0 ? Math.min(t1, t2) : Math.max(t1, t2);
  }

  if (t < 0) {
    console.log("Negative time, shooting at current position");
    return window.game.camera.pointToScreen({
      x: enemyPos._x,
      y: enemyPos._y,
    });
  }
  const predictedPos = {
    x: enemyPos._x + vex * t,
    y: enemyPos._y + vey * t,
  };

  return window.game.camera.pointToScreen(predictedPos);
}
    function calcAngle(playerPos, mePos) {
        const dx = mePos._x - playerPos._x;
        const dy = mePos._y - playerPos._y;

        return Math.atan2(dy, dx);
    }
function aimBot() {
  if (!state.isAimBotEnabled) return;

  const players = window.game.playerBarn.playerPool.pool;
  const me = window.game.activePlayer;

  try {
    const meTeam = getTeam(me);

    let enemy = null;
    let minDistanceToEnemyFromMouse = Infinity;

    if (
      state.focusedEnemy &&
      state.focusedEnemy.active &&
      !state.focusedEnemy.netData.dead
    ) {
      enemy = state.focusedEnemy;
    } else {
      if (state.focusedEnemy) {
        state.focusedEnemy = null;
        updateOverlay();
      }

      players.forEach((player) => {
        if (
          !player.active ||
          player.netData.dead ||
          (!state.isAimAtKnockedOutEnabled && player.downed) ||
          me.__id === player.__id ||
          me.layer !== player.layer ||
          getTeam(player) == meTeam ||
          state.friends.includes(player.nameText._text)
        )
          return;

        const screenPlayerPos = window.game.camera.pointToScreen({
          x: player.pos._x,
          y: player.pos._y,
        });
        const distanceToEnemyFromMouse =
          (screenPlayerPos.x - window.game.input.mousePos._x) ** 2 +
          (screenPlayerPos.y - window.game.input.mousePos._y) ** 2;

        if (distanceToEnemyFromMouse < minDistanceToEnemyFromMouse) {
          minDistanceToEnemyFromMouse = distanceToEnemyFromMouse;
          enemy = player;
        }
      });
    }

    if (enemy) {
      const meX = me.pos._x;
      const meY = me.pos._y;
      const enemyX = enemy.pos._x;
      const enemyY = enemy.pos._y;

      const distanceToEnemy = Math.hypot(meX - enemyX, meY - enemyY);
      if (enemy != state.enemyAimBot) {
        state.enemyAimBot = enemy;
        state.lastFrames[enemy.__id] = [];
      }

      const predictedEnemyPos = calculatePredictedPosForShoot(enemy, me);

      if (!predictedEnemyPos) return;

      window.lastAimPos = {
        clientX: predictedEnemyPos.x,
        clientY: predictedEnemyPos.y,
      };
      if (state.isMeleeAttackEnabled && distanceToEnemy <= 8) {
        const moveAngle = calcAngle(enemy.pos, me.pos) + Math.PI;
        window.aimTouchMoveDir = {
          x: Math.cos(moveAngle),
          y: Math.sin(moveAngle),
        };
        window.aimTouchDistanceToEnemy = distanceToEnemy;
      } else {
        window.aimTouchMoveDir = null;
        window.aimTouchDistanceToEnemy = null;
      }

      if (
        aimbotDot.style.left !== predictedEnemyPos.x + "px" ||
        aimbotDot.style.top !== predictedEnemyPos.y + "px"
      ) {
        aimbotDot.style.left = predictedEnemyPos.x + "px";
        aimbotDot.style.top = predictedEnemyPos.y + "px";
        aimbotDot.style.display = "block";
      }
    } else {
      window.aimTouchMoveDir = null;
      window.lastAimPos = null;
      aimbotDot.style.display = "none";
    }
  } catch (error) {
    console.error("Error in aimBot:", error);
  }
}

function aimBotToggle() {
  state.isAimBotEnabled = !state.isAimBotEnabled;
  if (state.isAimBotEnabled) return;

  aimbotDot.style.display = "None";
  window.lastAimPos = null;
  window.aimTouchMoveDir = null;
}

    function createElement(tag, styles = {}, innerHTML = '') {
        const element = document.createElement(tag);
        Object.assign(element.style, styles);
        element.innerHTML = innerHTML;
        return element;
    }

    function updateButtonColors() {
        const buttons = uiContainer.querySelectorAll('div[data-stateName]');
        buttons.forEach(button => {
            const stateName = button.getAttribute('data-stateName');
            const role = button.getAttribute('data-role');
            const isEnabled = state[stateName];
            button.style.color = isEnabled && role === 'sub' ? '#a8a922' : isEnabled ? 'white' : '#3e3e3e';
        });
    }

    function createFeatureButton(name, clickHandler, stateName, role='sup') {
        let button;
        if (role === 'sup'){
            button = createElement('div', {
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '18px',
                color: 'white',
                textAlign: 'left',
                cursor: 'pointer',
            }, name);
        }else if(role === 'sub'){
            button = createElement('div', {
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '16px',
                color: '#a8a922',
                textAlign: 'left',
                paddingLeft: '14px',
                cursor: 'pointer',
            }, name);

        }else {
            throw new Error('Invalid role specified for feature button');
        }

        button.setAttribute('data-stateName', stateName);
        button.setAttribute('data-role', role);

        button.addEventListener('click', () => {
            clickHandler();
            updateOverlay();
            updateButtonColors();
        });

        return button;
    }
    const uiContainer = createElement('div', {
        maxWidth: '400px',
        maxHeight: '400px',
        width: '30%',
        height: '60%',
        overflow: 'auto',
        backgroundColor: '#010302',
        borderRadius: '10px',
        position: 'fixed',
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'none',
        zIndex: 2147483646,
        userSelect: 'none',
        transition: 'transform 0.2s ease-in-out'
    });

    uiContainer.addEventListener('mouseenter', () => {
        window.game.inputBinds.menuHovered = true;
    });

    uiContainer.addEventListener('mouseleave', () => {
        window.game.inputBinds.menuHovered = false;
    });
    const meleeButton = createFeatureButton(
        "Melee Attack [X]",
        meleeAttackToggle,
        "isMeleeAttackEnabled",
        "sup",
    );
    uiContainer.appendChild(meleeButton);

    function syncMenuVisibility() {
        const gameMenu = document.getElementById('ui-game-menu');
        if (gameMenu) {
            const displayStyle = gameMenu.style.display;
            uiContainer.style.display = displayStyle;
        }
    }

    const observer = new MutationObserver(syncMenuVisibility);

    const gameMenu = document.getElementById('ui-game-menu');
    if (gameMenu) {
        observer.observe(gameMenu, { attributes: true, attributeFilter: ['style'] });
    }

    const styleSheet = createElement('style');
    styleSheet.innerHTML = `
@keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
}`;
    document.head.appendChild(styleSheet);

    class GameMod {
        constructor() {
            this.lastFrameTime = performance.now();
            this.frameCount = 0;
            this.fps = 0;
            this.kills = 0;
            this.setAnimationFrameCallback();

            if (window.location.hostname !== 'resurviv.biz' && window.location.hostname !== 'zurviv.io' && window.location.hostname !== 'eu-comp.net'){
                this.initCounters();
            }

            this.initMenu();
            this.initRules();

            this.setupWeaponBorderHandler();
        }

        initCounters() {
            this.counterContainer = document.createElement("div");
            this.counterContainer.id = "counterContainer";
            Object.assign(this.counterContainer.style, {
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                width: "185px",
                padding: "7px 7px",
                marginTop: "8px",
                borderRadius: "10px",
                textShadow: "3px 3px 4px black",
                fontFamily: "fantasy",
                fontWeight: "normal",
                fontSize: "15px",
                lineHeight: "1",
                zIndex: "10000",
                border: "2px solid #0000FF",
                pointerEvents: "none",
                display: "block",
                textAlign: "center",
            });

            this.fpsCounter = this.createCounterElement("FPS: 0");
            this.pingCounter = this.createCounterElement("Ping: 0ms");
            this.killsCounter = this.createCounterElement("Kills: 0");

            this.counterContainer.appendChild(this.fpsCounter);
            this.counterContainer.appendChild(this.pingCounter);
            this.counterContainer.appendChild(this.killsCounter);
            const uiTopLeft = document.getElementById("ui-top-left");
            if (uiTopLeft) {
                uiTopLeft.appendChild(this.counterContainer);
                uiTopLeft.appendChild(moduleList);
            }
        }

        createCounterElement(text) {
            const element = document.createElement("div");
            element.textContent = text;
            element.style.marginBottom = "5px";
            return element;
        }

        setAnimationFrameCallback() {
            this.animationFrameCallback = (callback) => setTimeout(callback, 1);
        }

        getKills() {
            const killElement = document.querySelector(
                ".ui-player-kills.js-ui-player-kills",
            );
            if (killElement) {
                const kills = parseInt(killElement.textContent, 10);
                return isNaN(kills) ? 0 : kills;
            }
            return 0;
        }

        startPingTest() {
          const currentUrl = window.location.href;
          const isSpecialUrl = /\/#\w+/.test(currentUrl);

          const teamSelectElement = document.getElementById("team-server-select");
          const mainSelectElement = document.getElementById("server-select-main");

          const region =
            isSpecialUrl && teamSelectElement
              ? teamSelectElement.value
              : mainSelectElement
                ? mainSelectElement.value
                : null;

          if (region && region !== this.currentServer) {
            this.currentServer = region;
            this.resetPing();

            let servers = window.servers;

            if (!servers) return;

            const selectedServer = servers.find(
              (server) => region.toUpperCase() === server.region.toUpperCase(),
            );

            if (selectedServer) {
              this.pingTest = new PingTest(selectedServer);
              this.pingTest.startPingTest();
            } else {
              this.resetPing();
            }
          }
        }

        resetPing() {
          if (this.pingTest && this.pingTest.test.ws) {
            this.pingTest.test.ws.close();
            this.pingTest.test.ws = null;
          }
          this.pingTest = null;
        }

        updateHealthBars() {
          const healthBars = document.querySelectorAll("#ui-health-container");
          healthBars.forEach((container) => {
            const bar = container.querySelector("#ui-health-actual");
            if (bar) {
              const width = Math.round(parseFloat(bar.style.width));
              let percentageText = container.querySelector(".health-text");

              if (!percentageText) {
                percentageText = document.createElement("span");
                percentageText.classList.add("health-text");
                Object.assign(percentageText.style, {
                    width: "100%",
                    textAlign: "center",
                    marginTop: "5px",
                    color: "#FF0000",
                    fontSize: "20px",
                    fontWeight: "bold",
                    fontFamily: "'Trebuchet MS', sans-serif",
                    textShadow: "2px 2px 3px black",
                    position: "absolute",
                    zIndex: "10",
                });
                container.appendChild(percentageText);
              }

              percentageText.textContent = `${width}%`;
            }
          });
        }

        updateBoostBars() {
            const boostCounter = document.querySelector("#ui-boost-counter");
            if (boostCounter) {
                const boostBars = boostCounter.querySelectorAll(
                    ".ui-boost-base .ui-bar-inner",
                );

                let totalBoost = 0;
                const weights = [25, 25, 40, 10];

                boostBars.forEach((bar, index) => {
                  const width = parseFloat(bar.style.width);
                  if (!isNaN(width)) {
                      totalBoost += width * (weights[index] / 100);
                  }
              });

              const averageBoost = Math.round(totalBoost);
              let boostDisplay = boostCounter.querySelector(".boost-display");

              if (!boostDisplay) {
                  boostDisplay = document.createElement("div");
                  boostDisplay.classList.add("boost-display");
                  Object.assign(boostDisplay.style, {
                      position: "absolute",
                      bottom: "75px",
                      right: "335px",
                      color: "#FFFFFF",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border: "2px solid #0000FF",
                      fontFamily: "'Trebuchet MS', sans-serif",
                      textShadow: "2px 2px 3px black",
                      fontSize: "14px",
                      zIndex: "10",
                      textAlign: "center",
                  });

                  boostCounter.appendChild(boostDisplay);
              }

              boostDisplay.textContent = `AD: ${averageBoost}%`;
          }
        }

        setupWeaponBorderHandler() {
            const weaponContainers = Array.from(
                document.getElementsByClassName("ui-weapon-switch"),
            );
            weaponContainers.forEach((container) => {
                if (container.id === "ui-weapon-id-4") {
                    container.style.border = "0px solid #2f4032";
                } else {
                    container.style.border = "0px solid #FFFFFF";
                }
            });

            const weaponNames = Array.from(
                document.getElementsByClassName("ui-weapon-name"),
            );
            weaponNames.forEach((weaponNameElement) => {
                const weaponContainer = weaponNameElement.closest(".ui-weapon-switch");
                const observer = new MutationObserver(() => {
                    const weaponName = weaponNameElement.textContent.trim();
                    let border = "#FFFFFF";

                    switch (weaponName.toUpperCase()) {
                            //yellow
                        case "CZ-3A1": case "G18C": case "M9": case "M93R": case "MAC-10": case "MP5": case "P30L": case "DUAL P30L": case "UMP9": case "VECTOR": case "VSS": case "FLAMETHROWER": border = "#FFAE00"; break;
                            //blue
                        case "AK-47": case "OT-38": case "OTS-38": case "M39 EMR": case "DP-28": case "MOSIN-NAGANT": case "SCAR-H": case "SV-98": case "M1 GARAND": case "PKP PECHENEG": case "AN-94": case "BAR M1918": case "BLR 81": case "SVD-63": case "M134": case "GROZA": case "GROZA-S": border = "#007FFF"; break;
                            //green
                        case "FAMAS": case "M416": case "M249": case "QBB-97": case "MK 12 SPR": case "M4A1-S": case "SCOUT ELITE": case "L86A2": border = "#0f690d"; break;
                            //red
                        case "M870": case "MP220": case "SAIGA-12": case "SPAS-12": case "USAS-12": case "SUPER 90": case "LASR GUN": case "M1100": border = "#FF0000"; break;
                            //purple
                        case "MODEL 94": case "PEACEMAKER": case "VECTOR (.45 ACP)": case "M1911": case "M1A1": border = "#800080"; break;
                            //black
                        case "DEAGLE 50": case "RAINBOW BLASTER": border = "#000000"; break;
                            //olive
                        case "AWM-S": case "MK 20 SSR": border = "#808000"; break;
                            //brown
                        case "POTATO CANNON": case "SPUD GUN": border = "#A52A2A"; break;
                            //other Guns
                        case "FLARE GUN": border = "#FF4500"; break; case "M79": border = "#008080"; break; case "HEART CANNON": border = "#FFC0CB"; break;
                        default: border = "#FFFFFF"; break; }

                    if (weaponContainer.id !== "ui-weapon-id-4") {
                        weaponContainer.style.border = `0px solid ${border}`;
                    }
                });

                observer.observe(weaponNameElement, {
                    childList: true,
                    characterData: true,
                    subtree: true,
                });
            });
        }

        initMenu() {
            const middleRow = document.querySelector("#start-row-top");
            Object.assign(middleRow.style, {
                display: "flex",
                flexDirection: "row",
            });
        }

        initRules() {
            const newsBlock = document.querySelector("#news-block");
        }

        startUpdateLoop() {
            const now = performance.now();
            const delta = now - this.lastFrameTime;

            this.frameCount++;

            if (delta >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / delta);
                this.frameCount = 0;
                this.lastFrameTime = now;

                this.kills = this.getKills();

                if (this.fpsCounter) {
                    this.fpsCounter.textContent = `FPS: ${this.fps}`;
                    this.fpsCounter.style.fontFamily = '"Trebuchet MS", sans-serif';
                    this.fpsCounter.style.fontSize = '15px';
                    this.fpsCounter.style.color = "#FFFFFF";

                }

                if (this.killsCounter) {
                    this.killsCounter.textContent = `Kills: ${this.kills}`;
                    this.killsCounter.style.fontFamily = '"Trebuchet MS", sans-serif';
                    this.killsCounter.style.fontSize = '15px';
                    this.killsCounter.style.color = "#FFFFFF";

                }

                if (this.pingCounter && this.pingTest) {
                    const result = this.pingTest.getPingResult();
                    this.pingCounter.textContent = `Ping: ${result.ping} ms`;
                    this.pingCounter.style.fontFamily = '"Trebuchet MS", sans-serif';
                    this.pingCounter.style.fontSize = '15px';
                    this.pingCounter.style.color = "#FFFFFF";

                }
            }

            if (this.counterContainer.style.display !== "none") {
                moduleList.style.display = "block";
            } else {
                moduleList.style.display = "none";
            }

            this.startPingTest();
            this.updateBoostBars();
            this.updateHealthBars();
        }

    }

    class PingTest {
        constructor(selectedServer) {
          this.ptcDataBuf = new ArrayBuffer(1);
          this.test = {
            region: selectedServer.region,
            url: `wss://${selectedServer.url}/ptc`,
            ping: 9999,
            ws: null,
            sendTime: 0,
            retryCount: 0,
          };
        }

        startPingTest() {
          if (!this.test.ws) {
            const ws = new WebSocket(this.test.url);
            ws.binaryType = "arraybuffer";

            ws.onopen = () => {
              this.sendPing();
              this.test.retryCount = 0;
            };

            ws.onmessage = () => {
              const elapsed = (Date.now() - this.test.sendTime) / 1e3;
              this.test.ping = Math.round(elapsed * 1000);
              this.test.retryCount = 0;
              setTimeout(() => this.sendPing(), 200);
            };

            ws.onerror = () => {
              this.test.ping = "Error";
              this.test.retryCount++;
              if (this.test.retryCount < 5) {
                setTimeout(() => this.startPingTest(), 2000);
              } else {
                this.test.ws.close();
                this.test.ws = null;
              }
            };

            ws.onclose = () => {
              this.test.ws = null;
            };

            this.test.ws = ws;
          }
        }

        sendPing() {
          if (this.test.ws.readyState === WebSocket.OPEN) {
            this.test.sendTime = Date.now();
            this.test.ws.send(this.ptcDataBuf);
          }
        }

        getPingResult() {
          return {
            region: this.test.region,
            ping: this.test.ping,
          };
        }
    }

    window.GameMod = new GameMod();
    console.log('Script injecting...');


    function goldenRetriever(url) {
        return fetch(url).then(response => response.text());
    }

    (async () => {
        const links = [
            ...Array.from(document.querySelectorAll('link[rel="modulepreload"][href]')),
            ...Array.from(document.querySelectorAll('script[type="module"][src]'))
        ];

        const appLink = links.find(link => link.src?.includes('app-'));
        const sharedLink = links.find(link => link.href?.includes('shared-'));
        const vendorLink = links.find(link => link.href?.includes('vendor-'));


        const originalAppURL = 'https://cdn.jsdelivr.net/gh/Dmitrij799/kri@9d94d030467c8ce42cce818ba96b1c8c69a42fac/app-CD67ICkF.js';
        const originalSharedURL = 'https://cdn.jsdelivr.net/gh/Dmitrij799/kri@9d94d030467c8ce42cce818ba96b1c8c69a42fac/shared-CLLToCHh.js';
        const originalVendorURL = 'https://cdn.jsdelivr.net/gh/Dmitrij799/kri@9d94d030467c8ce42cce818ba96b1c8c69a42fac/vendor-DI5YnaFM.js';

        let modifiedSharedURL = null;
        let modifiedAppURL = null;
        if (originalSharedURL) {
            let scriptContent = await goldenRetriever(originalSharedURL);

            const sharedScriptPatches = [
                {
                    name: 'bullets',
                    from: /function\s+(\w+)\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{\s*return\s+(\w+)\((\w+),\s*(\w+),\s*(\w+)\)\s*\}\s*const\s+(\w+)\s*=\s*\{\s*(\w+)\s*:\s*\{\s*type\s*:\s*"(.*?)"\s*,\s*damage\s*:\s*(\d+)\s*,/,
                    to: `function $1($2, $3) {\n    return $4($5, $6, $7)\n}\nconst $8 = window.bullets = {\n    $9: {\n        type: "$10",\n        damage: $11,`
                },
                {
                    name: 'explosions',
                    from: /(\w+)=\{explosion_frag:\{type:"explosion",damage:(\d+),obstacleDamage/,
                    to: `$1 = window.explosions = {explosion_frag:{type:"explosion",damage:$2,obstacleDamage`
                },
                {
                    name: 'guns',
                    from: /(\w+)=\{(\w+):\{name:"([^"]+)",type:"gun",quality:(\d+),fireMode:"([^"]+)",caseTiming:"([^"]+)",ammo:"([^"]+)",/,
                    to: `$1 = window.guns = {$2:{name:"$3",type:"gun",quality:$4,fireMode:"$5",caseTiming:"$6",ammo:"$7",`
                },
                {
                    name: 'throwable',
                    from: /(\w+)=\{(\w+):\{name:"([^"]+)",type:"throwable",quality:(\d+),explosionType:"([^"]+)",/,
                    to: `$1 = window.throwable = {$2:{name:"$3",type:"throwable",quality:$4,explosionType:"$5",`
                },
                {
                    name: 'objects',
                    from: /\s*(\w+)\s*=\s*\{\s*(\w+)\s*:\s*Ve\(\{\}\)\s*,\s*(\w+)\s*:\s*Ve\(\{\s*img\s*:\s*\{\s*tint\s*:\s*(\d+)\s*\}\s*,\s*loot\s*:\s*\[\s*n\("(\w+)",\s*(\d+),\s*(\d+)\)\s*,\s*d\("(\w+)",\s*(\d+)\)\s*,\s*d\("(\w+)",\s*(\d+)\)\s*,\s*d\("(\w+)",\s*(\d+)\)\s*\]\s*\}\)\s*,/,
                    to: ` $1 = window.objects = {\n    $2: Ve({}),\n    $3: Ve({\n        img: {\n            tint: $4\n        },\n        loot: [\n            n("$5", $6, $7),\n            d("$8", $9),\n            d("$10", $11),\n            d("$12", $13)\n        ]\n    }),`
                }
            ];

            for (const patch of sharedScriptPatches){
                scriptContent = scriptContent.replace(patch.from, patch.to);
            }

            const blob = new Blob([scriptContent], { type: 'application/javascript' });
            modifiedSharedURL = URL.createObjectURL(blob);
            console.log(modifiedSharedURL);
        }
        let modifiedAppScript;
        if (originalAppURL) {
            let scriptContent = await goldenRetriever(originalAppURL);

            const appScriptPatches = [
                {
                    name: 'Import shared.js',
                    from: /"\.\/shared-[^"]+\.js";/,
                    to: `"${modifiedSharedURL}";`
                },
                {
                    name: 'Import vendor.js',
                    from: /\.\/vendor-[a-zA-Z0-9]+\.js/,
                    to: `${originalVendorURL}`
                },
                {
                    name: 'servers',
                    from: /var\s+(\w+)\s*=\s*\[\s*({\s*region:\s*"([^"]+)",\s*zone:\s*"([^"]+)",\s*url:\s*"([^"]+)",\s*https:\s*(!0|!1)\s*}\s*(,\s*{\s*region:\s*"([^"]+)",\s*zone:\s*"([^"]+)",\s*url:\s*"([^"]+)",\s*https:\s*(!0|!1)\s*})*)\s*\];/,
                    to: `var $1 = window.servers = [$2];`
                },
                {
                    name: 'Map colorizing',
                    from: /(\w+)\.sort\(\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*=>\s*\2\.zIdx\s*-\s*\3\.zIdx\s*\);/,
                    to: `$1.sort(($2, $3) => $2.zIdx - $3.zIdx);\nwindow.mapColorizing($1);`
                },
                {
                    name: 'Position without interpolation (pos._x, pos._y)',
                    from: /this\.pos\s*=\s*(\w+)\.copy\((\w+)\.netData\.pos\)/,
                    to: `this.pos = $1.copy($2.netData.pos),this.pos._x = this.netData.pos.x, this.pos._y = this.netData.pos.y`
                },
                {
                    name: 'Movement interpolation (Game optimization)',
                    from: 'this.pos._y = this.netData.pos.y',
                    to: `this.pos._y = this.netData.pos.y,(window.movementInterpolation) &&
                                                        !(
                                                            Math.abs(this.pos.x - this.posOld.x) > 18 ||
                                                            Math.abs(this.pos.y - this.posOld.y) > 18
                                                        ) &&
                                                            ((this.pos.x += (this.posOld.x - this.pos.x) * 0.5),
                                                            (this.pos.y += (this.posOld.y - this.pos.y) * 0.5))`
                },
                {
                    name: 'Mouse position without server delay (Game optimization)',
                    from: '-Math.atan2(this.dir.y,this.dir.x)}',
                    to: `-Math.atan2(this.dir.y, this.dir.x),
                (window.localRotation) &&
    ((window.game.activeId == this.__id && !window.game.spectating) &&
        (this.bodyContainer.rotation = Math.atan2(
            window.game.input.mousePos.y - window.innerHeight / 2,
            window.game.input.mousePos.x - window.innerWidth / 2
        )),
    (window.game.activeId != this.__id) &&
        (this.bodyContainer.rotation = -Math.atan2(this.dir.y, this.dir.x)));
                }`
                },
                {
                    name: 'Class definition with methods',
                    from: /(\w+)\s*=\s*24;\s*class\s+(\w+)\s*\{([\s\S]*?)\}\s*function/,
                    to: `$1 = 24;\nclass $2 {\n$3\n}window.pieTimerClass = $2;\nfunction`
                },
                {
                    name: 'isMobile (basicDataInfo)',
                    from: /(\w+)\.isMobile\s*=\s*(\w+)\.mobile\s*\|\|\s*window\.mobile\s*,/,
                    to: `$1.isMobile = $2.mobile || window.mobile,window.basicDataInfo = $1,`
                },
                {
                    name: 'Game',
                    from: /this\.shotBarn\s*=\s*new\s*(\w+)\s*;/,
                    to: `window.game = this,this.shotBarn = new $1;`
                },
                {
                    name: 'Override gameControls',
                    from: /this\.sendMessage\s*\(\s*(\w+)\.(\w+)\s*,\s*(\w+)\s*,\s*(\d+)\s*\)\s*,\s*this\.inputMsgTimeout\s*=\s*(\d+)\s*,\s*this\.prevInputMsg\s*=\s*(\w+)\s*\)/,
                    to: `this._newGameControls = window.initGameControls($3), this.sendMessage($1.$2, this._newGameControls, $4),\nthis.inputMsgTimeout = $5,\nthis.prevInputMsg = this._newGameControls)`
                },
            ];

            for (const patch of appScriptPatches){
                scriptContent = scriptContent.replace(patch.from, patch.to);
            }

            modifiedAppScript = scriptContent;

            const blob = new Blob([scriptContent], { type: 'application/javascript' });
            modifiedAppURL = URL.createObjectURL(blob);
            console.log(modifiedAppURL);

        }

        if (!originalAppURL || !originalSharedURL || !originalVendorURL){
            console.error('originalAppURL or originalSharedURL or originalVendorURL is not found', originalAppURL, originalSharedURL, originalVendorURL);
            return;
        }

        const isolatedHandlers = [];
        const originalAddEventListener = document.addEventListener;
        document.addEventListener = function (type, listener, options) {
            if (type === 'DOMContentLoaded') {
                isolatedHandlers.push(listener);
            } else {
                originalAddEventListener.call(document, type, listener, options);
            }
        };

        const appScript = document.createElement('script');
        appScript.type = 'module';
        appScript.src = modifiedAppURL;
        appScript.onload = () => {
            console.log('Im injected appjs', appScript);
            document.addEventListener = originalAddEventListener;
            isolatedHandlers.forEach((handler) => handler.call(document));
        };
        document.head.append(appScript);
    })();



    console.log('Script injected');


    const playerOptionsDiv = document.getElementById('player-options');


    setInterval(() => {
        const nameInputField = document.getElementById('player-name-input-solo');
    }, 100);

    window.localRotation = true;
    if (window.location.hostname !== 'resurviv.biz' && window.location.hostname !== 'zurviv.io' && window.location.hostname !== 'eu-comp.net'){
        window.movementInterpolation = true;
    }else {
        window.movementInterpolation = false;
    }

    const fontAwesome = document.createElement('link');
    fontAwesome.rel = "stylesheet";
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css";
    document.head.append(fontAwesome);


    const styles = document.createElement('style');
    styles.innerHTML = `
.NOVA-overlay{
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    pointer-events: None;
    color: #fff;
    font-family: monospace;
    text-shadow: 0 0 5px rgba(0, 0, 0, .5);
    z-index: 1;
}

.NOVA-title{
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 25px;
    text-shadow: 0 0 10px rgba(0, 0, 0, .9);
    color: #fff;
    font-family: monospace;
    pointer-events: None;
}

.NOVA-control{
    text-align: left;
    margin-top: 3px;
    margin-bottom: 3px;
    font-size: 18px;
}

#news-current ul{
    margin-left: 20px;
    padding-left: 6px;
}
`;

    document.head.append(styles);

    let colors = {
        container_06: 14934793,
        barn_02: 14934793,
        stone_02: 1654658,
        tree_03: 16777215,
        stone_04: 0xeb175a,
        stone_05: 0xeb175a,
        bunker_storm_01: 14934793,
        chest_01: 16777215,
        chest_01cb: 16777215
    },
    sizes = {
        stone_02: 6,
        tree_03: 8,
        stone_04: 6,
        stone_05: 6,
        bunker_storm_01: 1.75,
        chest_01: 6,
    };

    window.mapColorizing = map => {

        map.forEach(object => {
            if ( !colors[object.obj.type] ) return;
            object.shapes.forEach(shape => {
                shape.color = colors[object.obj.type];
                console.log(object);
                if ( !sizes[object.obj.type] ) return;
                shape.scale = sizes[object.obj.type];
                console.log(object);
            });
        });
    };


    state.isObstacleTransparent = true;
    state.isAutoLootEnabled = false;


    function keybinds() {
        window.document.addEventListener("keyup", function (event) {
            if (!window?.game?.ws) return;

            const validKeys = ["Z", "P", "O", "K", "H", "N", "U", "B", "J", "Y", "I", "X", "L", "E"];

            if (!validKeys.includes(String.fromCharCode(event.keyCode))) return;

            switch (String.fromCharCode(event.keyCode)) {
                case validKeys[0]:
                    state.isZoomEnabled = !state.isZoomEnabled;
                    break;
                case validKeys[1]:
                    state.isLaserDrawerEnabled = !state.isLaserDrawerEnabled;
                    break;
                case validKeys[2]:
                    state.isObstacleTransparent = !state.isObstacleTransparent;
                    obstacleOpacity();
                    break;
                case validKeys[3]:
                    state.isLineDrawerEnabled = !state.isLineDrawerEnabled;
                    break;
                case validKeys[4]:
                    qs = !qs;
                    break;
                case validKeys[5]:
                    console.log(`🔀 Toggling ceilings: ${state.areCeilingsRemoved}`); 
                    state.isUseOneGunEnabled = !state.isUseOneGunEnabled;
                    break;
                case validKeys[6]:
                    vn = !vn;
                    visibleNames();
                    break;
               case validKeys[7]:
                    state.isAimBotEnabled = !state.isAimBotEnabled;
                    console.log(`🎯 Aimbot: ${state.isAimBotEnabled ? "Enabled" : "Disabled"}`);
                    break;
                case validKeys[8]:
                    state.isAimAtKnockedOutEnabled = !state.isAimAtKnockedOutEnabled;
                    console.log(`Aim at Downed: ${state.isAimAtKnockedOutEnabled ? "Enabled" : "Disabled"}`);
                    updateOverlay();
                    updateButtonColors();
                    break;
                case validKeys[9]:
                    state.isSpinBotEnabled = !state.isSpinBotEnabled;
                    break;
                case validKeys[10]:
                    console.log("i pressed");
                    toggleOverlay();
                    break;
                case "X":
                    meleeAttackToggle();
                    break;
                case "L":
                    state.isFollowBotEnabled = !state.isFollowBotEnabled;
                    console.log(
                        `Follow Bot: ${state.isFollowBotEnabled ? "Enabled" : "Disabled"}`,
                    );
                    updateOverlay();
                    updateButtonColors();
                    break;
                case "E":
                    state.isPanHeroEnabled = !state.isPanHeroEnabled;
                    console.log(`Pan Hero: ${state.isPanHeroEnabled ? "Enabled" : "Disabled"}`);
                    break;
            }

            updateOverlay();
            updateButtonColors();
        });

        window.document.addEventListener('mousedown', function (event) {
            if (event.button !== 1) return;

            const mouseX = event.clientX;
            const mouseY = event.clientY;

            const players = window.game.playerBarn.playerPool.pool;
            const me = window.game.activePlayer;
            const meTeam = getTeam(me);

            let enemy = null;
            let minDistanceToEnemyFromMouse = Infinity;

            players.forEach((player) => {
                if (!player.active || player.netData.dead || player.downed || me.__id === player.__id || getTeam(player) == meTeam) return;

                const screenPlayerPos = window.game.camera.pointToScreen({x: player.pos._x, y: player.pos._y});
                const distanceToEnemyFromMouse = (screenPlayerPos.x - mouseX) ** 2 + (screenPlayerPos.y - mouseY) ** 2;

                if (distanceToEnemyFromMouse < minDistanceToEnemyFromMouse) {
                    minDistanceToEnemyFromMouse = distanceToEnemyFromMouse;
                    enemy = player;
                }
            });

            if (enemy) {
                const enemyIndex = state.friends.indexOf(enemy.nameText._text);
                if (~enemyIndex) {
                    state.friends.splice(enemyIndex, 1);
                    console.log(`Removed player with name ${enemy.nameText._text} from friends.`);
                }else {
                    state.friends.push(enemy.nameText._text);
                    console.log(`Added player with name ${enemy.nameText._text} to friends.`);
                }
            }
        });
    }
    keybinds();



    let rc = true;
    state.areCeilingsRemoved = false;
    let originalPush = null;

    function removeCeilings(){

        if(rc){

             Object.defineProperty( Object.prototype, 'textureCacheIds', {
                 set( value ) {
                     this._textureCacheIds = value;

                     if ( Array.isArray( value ) ) {
                         const scope = this;

                         value.push = new Proxy( value.push, {
                             apply( target, thisArgs, args ) {
                                 if (args[0].includes('ceiling') && !args[0].includes('map-building-container-ceiling-05') || args[0].includes('map-snow-')) {
                                     Object.defineProperty( scope, 'valid', {
                                         set( value ) {
                                             this._valid = value;
                                         },
                                         get() {
                                             return false ;
                                         }
                                     });
                                 }
                                 return Reflect.apply( ...arguments );

                             }
                         });

                     }

                 },
                 get() {
                     return this._textureCacheIds;
                 }
             });

             console.log("rc on");

        } else {

            delete Object.prototype.textureCacheIds;

            console.log("rc off");

        }

    }

    removeCeilings();

    let al = false;

    function autoLoot(){

        if(al){

            Object.defineProperty(window, 'basicDataInfo', {
                get () {
                    return this._basicDataInfo;
                },
                set(value) {
                    this._basicDataInfo = value;

                    if (!value) return;

                    Object.defineProperty(window.basicDataInfo, 'isMobile', {
                        get () {
                            return true;
                        },
                        set(value) {
                        }
                    });

                    Object.defineProperty(window.basicDataInfo, 'useTouch', {
                        get () {
                            return true;
                        },
                        set(value) {
                        }
                    });

                }
            });

        } else {

            Object.defineProperty(window, 'basicDataInfo', {
                get () {
                    return this._basicDataInfo;
                },
                set(value) {
                    this._basicDataInfo = value;

                    if (!value) return;

                    Object.defineProperty(window.basicDataInfo, 'isMobile', {
                        get () {
                            return false;
                        },
                        set(value) {
                        }
                    });

                    Object.defineProperty(window.basicDataInfo, 'useTouch', {
                        get () {
                            return false;
                        },
                        set(value) {
                        }
                    });

                }
            });

        }

    }

    autoLoot();

    const inputCommands = {
        Cancel: 6,
        Count: 36,
        CycleUIMode: 30,
        EmoteMenu: 31,
        EquipFragGrenade: 15,
        EquipLastWeap: 19,
        EquipMelee: 13,
        EquipNextScope: 22,
        EquipNextWeap: 17,
        EquipOtherGun: 20,
        EquipPrevScope: 21,
        EquipPrevWeap: 18,
        EquipPrimary: 11,
        EquipSecondary: 12,
        EquipSmokeGrenade: 16,
        EquipThrowable: 14,
        Fire: 4,
        Fullscreen: 33,
        HideUI: 34,
        Interact: 7,
        Loot: 10,
        MoveDown: 3,
        MoveLeft: 0,
        MoveRight: 1,
        MoveUp: 2,
        Reload: 5,
        Revive: 8,
        StowWeapons: 27,
        SwapWeapSlots: 28,
        TeamPingMenu: 32,
        TeamPingSingle: 35,
        ToggleMap: 29,
        Use: 9,
        UseBandage: 23,
        UseHealthKit: 24,
        UsePainkiller: 26,
        UseSoda: 25,
    };

    let inputs = [];
 window.initGameControls = function (gameControls) {
  for (const command of inputs) {
    gameControls.addInput(inputCommands[command]);
  }
  inputs = [];

  const me = window.game.activePlayer;
  if (
    !state.isMeleeAttackEnabled ||
    !window.game.inputBinds.isBindDown(inputCommands.Fire)
  ) {
    window.aimTouchMoveDir = null;
  }
  if (
    state.isMeleeAttackEnabled &&
    window.game.inputBinds.isBindDown(inputCommands.Fire) &&
    me
  ) {
    const players = window.game.playerBarn.playerPool.pool;
    let closestTarget = null;
    let minDistance = Infinity;

    players.forEach((player) => {
      if (
        !player.active ||
        player.netData.dead ||
        player.__id === me.__id ||
        (!state.isAimAtKnockedOutEnabled && player.downed) ||
        state.friends.includes(player.nameText._text)
      )
        return;

      const isTeammate = getTeam(player) === getTeam(me);

      if (!state.isFollowBotEnabled && isTeammate) return;
      if (state.isFollowBotEnabled && !isTeammate) return;

      const dx = player.pos.x - me.pos.x;
      const dy = player.pos.y - me.pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestTarget = player;
      }
    });

    if (closestTarget && minDistance <= state.meleeRange) {
      const predictedPos = calculatePredictedPosForShoot(closestTarget, me);

      let angle;
      if (predictedPos) {
        angle = Math.atan2(
          predictedPos.y - window.innerHeight / 2,
          predictedPos.x - window.innerWidth / 2,
        );
      } else {
        angle = Math.atan2(
          closestTarget.pos.y - me.pos.y,
          closestTarget.pos.x - me.pos.x,
        );
      }
      if (me.bodyContainer) {
        me.bodyContainer.rotation = angle;
      }
      const moveAngle = Math.atan2(
        closestTarget.pos.y - me.pos.y,
        closestTarget.pos.x - me.pos.x,
      );

      window.aimTouchMoveDir = {
        x: Math.cos(moveAngle),
        y: Math.sin(moveAngle),
      };

      gameControls.touchMoveActive = true;
      gameControls.touchMoveLen = 255;
      gameControls.touchMoveDir.x = window.aimTouchMoveDir.x;
      gameControls.touchMoveDir.y = window.aimTouchMoveDir.y;
      gameControls.addInput(inputCommands["EquipMelee"]);
    }
  }

  return gameControls;
};


    function bumpFire(){
        window.game.inputBinds.isBindPressed = new Proxy( window.game.inputBinds.isBindPressed, {
            apply( target, thisArgs, args ) {
                if (args[0] === inputCommands.Fire) {
                    return window.game.inputBinds.isBindDown(...args);
                }
                return Reflect.apply( ...arguments );
            }
        });
    }

    let spinAngle = 0;
    const radius = 100;
    const spinSpeed = 45;
    let spinPaused = false;
    let spinResumeTimeout = null;
    function overrideMousePos() {
        const PAN_HERO_ANGLE_OFFSET = 50; //dont change its perfect
        Object.defineProperty(window.game.input.mousePos, "x", {
            get() {
                const me = window.game.activePlayer;

                if (me && me.throwableState === "cook") {
                    return window.mousePosition.x;
                }
                if (
                    window.game.inputBinds.isBindDown(inputCommands.EmoteMenu) ||
                    window.game.inputBinds.isBindPressed(inputCommands.EmoteMenu)
                ) {
                    return window.mousePosition.x;
                }

                if (window.game.inputBinds.isBindDown(inputCommands.Fire)) {
                    const enemy = findClosestEnemy();
                    if (enemy) {
                        const predictedPos = calculatePredictedPosForShoot(enemy, me);
                        if (predictedPos) {
                            spinPaused = true;
                            clearTimeout(spinResumeTimeout);
                            spinResumeTimeout = setTimeout(() => {
                                spinPaused = false;
                            }, 50);
                            return predictedPos.x;
                        }
                    }
                }

                if (state.isPanHeroEnabled) {
                    const enemy = findClosestEnemy();
                    if (enemy) {
                        const meX = me.pos._x;
                        const meY = me.pos._y;
                        const enemyX = enemy.pos._x;
                        const enemyY = enemy.pos._y;
                        const oppositeX = meX - (enemyX - meX);
                        const oppositeY = meY - (enemyY - meY);

                        const aimTargetPos = window.game.camera.pointToScreen({
                            x: oppositeX - 3,
                            y: oppositeY,
                        });

                        let angleToTarget = Math.atan2(
                            aimTargetPos.y - window.innerHeight / 2,
                            aimTargetPos.x - window.innerWidth / 2
                        );
                        angleToTarget += (PAN_HERO_ANGLE_OFFSET * Math.PI) / 180;  
                        me.bodyContainer.rotation = angleToTarget;

                        return aimTargetPos.x;
                    }
                }

                if (
                    state.isAimBotEnabled &&
                    state.focusedEnemy &&
                    window.game.inputBinds.isBindDown(inputCommands.Fire) &&
                    window.game.activePlayer?.throwableState !== "cook"
                ) {
                    const enemy = findClosestEnemy();
                    if (enemy) {
                        const predictedPos = calculatePredictedPosForShoot(enemy, me);
                        if (predictedPos) {
                            spinPaused = true;
                            clearTimeout(spinResumeTimeout);
                            spinResumeTimeout = setTimeout(() => {
                                spinPaused = false;
                            }, 50);
                            return predictedPos.x;
                        }
                    }
                }

                if (window.game.inputBinds.isBindDown(inputCommands.Fire)) {
                    spinPaused = true;
                    clearTimeout(spinResumeTimeout);
                    spinResumeTimeout = setTimeout(() => {
                        spinPaused = false;
                    }, 50);
                    return this._x;
                }

                if (
                    state.isSpinBotEnabled &&
                    !window.game.inputBinds.isBindDown(inputCommands.Fire) &&
                    !spinPaused
                ) {
                    spinAngle = (spinAngle + spinSpeed) % 360;
                    return (
                        Math.cos(degreesToRadians(spinAngle)) * radius +
                        window.innerWidth / 2
                    );
                }

                return this._x;
            },
            set(value) {
                this._x = value;
            },
        });

        Object.defineProperty(window.game.input.mousePos, "y", {
            get() {
                const me = window.game.activePlayer;

                if (me && me.throwableState === "cook") {
                    return window.mousePosition.y;
                }
                if (
                    window.game.inputBinds.isBindDown(inputCommands.EmoteMenu) ||
                    window.game.inputBinds.isBindPressed(inputCommands.EmoteMenu)
                ) {
                    return window.mousePosition.y;
                }

                if (window.game.inputBinds.isBindDown(inputCommands.Fire)) {
                    const enemy = findClosestEnemy();
                    if (enemy) {
                        const predictedPos = calculatePredictedPosForShoot(enemy, me);
                        if (predictedPos) {
                            spinPaused = true;
                            clearTimeout(spinResumeTimeout);
                            spinResumeTimeout = setTimeout(() => {
                                spinPaused = false;
                            }, 50);
                            return predictedPos.y;
                        }
                    }
                }

                if (state.isPanHeroEnabled) {
                    const enemy = findClosestEnemy();
                    if (enemy) {
                        const meX = me.pos._x;
                        const meY = me.pos._y;
                        const enemyX = enemy.pos._x;
                        const enemyY = enemy.pos._y;
                        const oppositeX = meX - (enemyX - meX);
                        const oppositeY = meY - (enemyY - meY);

                        const aimTargetPos = window.game.camera.pointToScreen({
                            x: oppositeX - 3,
                            y: oppositeY,
                        });


                        let angleToTarget = Math.atan2(
                            aimTargetPos.y - window.innerHeight / 2,
                            aimTargetPos.x - window.innerWidth / 2
                        );
                        angleToTarget += (PAN_HERO_ANGLE_OFFSET * Math.PI) / 180;  

                        return aimTargetPos.y;
                    }
                }

                if (
                    state.isAimBotEnabled &&
                    state.focusedEnemy &&
                    window.game.inputBinds.isBindDown(inputCommands.Fire) &&
                    window.game.activePlayer?.throwableState !== "cook"
                ) {
                    const enemy = findClosestEnemy();
                    if (enemy) {
                        const predictedPos = calculatePredictedPosForShoot(enemy, me);
                        if (predictedPos) {
                            spinPaused = true;
                            clearTimeout(spinResumeTimeout);
                            spinResumeTimeout = setTimeout(() => {
                                spinPaused = false;
                            }, 50);
                            return predictedPos.y;
                        }
                    }
                }

                if (window.game.inputBinds.isBindDown(inputCommands.Fire)) {
                    spinPaused = true;
                    clearTimeout(spinResumeTimeout);
                    spinResumeTimeout = setTimeout(() => {
                        spinPaused = false;
                    }, 50);
                    return this._y;
                }
                if (
                    state.isSpinBotEnabled &&
                    !window.game.inputBinds.isBindDown(inputCommands.Fire) &&
                    !spinPaused
                ) {
                    return (
                        Math.sin(degreesToRadians(spinAngle)) * radius +
                        window.innerHeight / 2
                    );
                }

                return this._y;
            },
            set(value) {
                this._y = value;
            },
        });
    }
    function findClosestEnemy() {
        const players = window.game.playerBarn.playerPool.pool;
        const me = window.game.activePlayer;
        const meTeam = getTeam(me);
        let closestEnemy = null;
        let minDistance = Infinity;

        players.forEach((player) => {
            if (
                !player.active ||
                player.netData.dead ||
                player.__id === me.__id ||
                getTeam(player) === meTeam ||
                state.friends.includes(player.nameText._text)
            )
                return;
            if (player.layer !== me.layer) return;
            if (!state.isAimAtKnockedOutEnabled && player.downed) return;
            const screenPlayerPos = window.game.camera.pointToScreen({
                x: player.pos._x,
                y: player.pos._y,
            });

            const dx = screenPlayerPos.x - window.mousePosition.x;
            const dy = screenPlayerPos.y - window.mousePosition.y;

            const distance = dx * dx + dy * dy;
            if (distance < minDistance) {
                minDistance = distance;
                closestEnemy = player;
            }
        });
        return closestEnemy;
    }
    window.mousePosition = { x: 0, y: 0 };

    document.addEventListener('mousemove', function(event) {
        window.mousePosition.x = event.clientX;
        window.mousePosition.y = event.clientY;
    });


    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    function betterZoom(){
        Object.defineProperty(window.game.camera, 'zoom', {
            get() {
                return Math.max(window.game.camera.targetZoom - (state.isZoomEnabled ? 0.45 : 0), 0.35);
            },
            set(value) {
            }
        });

        let oldScope = window.game.activePlayer.localData.scope;
        Object.defineProperty(window.game.camera, 'targetZoom', {
            get(){
                return this._targetZoom;
            },
            set(value) {
                const newScope = window.game.activePlayer.localData.scope;
                const inventory = window.game.activePlayer.localData.inventory;
                const scopes = ['1xscope', '2xscope', '4xscope', '8xscope', '15xscope'];

                if (
                  (newScope == oldScope) && (inventory['2xscope'] || inventory['4xscope'] || inventory['8xscope'] || inventory['15xscope']) && value >= this._targetZoom
                  || scopes.indexOf(newScope) > scopes.indexOf(oldScope) && value >= this._targetZoom
                ) return;

                oldScope = window.game.activePlayer.localData.scope;
                this._targetZoom = value;
            }
        });
    }

    function smokeOpacity(){
        console.log('smokeopacity');

        const particles = window.game.smokeBarn.particles;
        console.log('smokeopacity', particles, window.game.smokeBarn.particles);
        particles.push = new Proxy( particles.push, {
            apply( target, thisArgs, args ) {
                console.log('smokeopacity', args[0]);
                const particle = args[0];

                Object.defineProperty(particle.sprite, 'alpha', {
                    get() {
                        return 0.12;
                    },
                    set(value) {
                    }
                });

                return Reflect.apply( ...arguments );

            }
        });

        particles.forEach(particle => {
            Object.defineProperty(particle.sprite, 'alpha', {
                get() {
                    return 0.12;
                },
                set(value) {
                }
            });
        });
    }

    let vn = false;

    function visibleNames(){

        const pool = window.game.playerBarn.playerPool.pool;

        console.log('Updating player name visibility...');

        pool.forEach(player => {
            Object.defineProperty(player.nameText, 'visible', {
                get() {
                    if (!vn) return false;

                    const me = window.game.activePlayer;
                    const meTeam = getTeam(me);
                    const playerTeam = getTeam(player);

                    this.tint = playerTeam === meTeam ? 0x00ffFF :
                    state.friends.includes(player.nameText._text) ? GREEN : RED;

                    player.nameText.style.fontSize = 30;
                    return true;
                },
                set(value) {}
            });
        });
    }

    function esp(){
        const pixi = window.game.pixi;
        const me = window.game.activePlayer;
        const players = window.game.playerBarn.playerPool.pool;

        if (!pixi || me?.container == undefined) {
            return;
        }

        const meX = me.pos.x;
        const meY = me.pos.y;
        const meTeam = getTeam(me);

        try{
            const lineDrawer = me.container.lineDrawer;
        try{lineDrawer.clear();}
            catch{if(!window.game?.ws || window.game?.activePlayer?.netData?.dead) return;}
            if (state.isLineDrawerEnabled){
                if (!me.container.lineDrawer) {
                    me.container.lineDrawer = new PIXI.Graphics();
                    me.container.addChild(me.container.lineDrawer);
                }

                players.forEach((player) => {
                    if (!player.active || player.netData.dead || me.__id == player.__id) return;

                    const playerX = player.pos.x;
                    const playerY = player.pos.y;
                    const playerTeam = getTeam(player);

                    const lineColor = playerTeam === meTeam ? BLUE : state.friends.includes(player.nameText._text) ? GREEN : me.layer === player.layer && (state.isAimAtKnockedOutEnabled || !player.downed) ? RED : WHITE;

                    lineDrawer.lineStyle(2, lineColor, 1);
                    lineDrawer.moveTo(0, 0);
                    lineDrawer.lineTo(
                        (playerX - meX) * 16,
                        (meY - playerY) * 16
                    );
                });
            }

            const nadeDrawer = me.container.nadeDrawer;
            try{nadeDrawer?.clear();}
            catch{if(!window.game?.ws || window.game?.activePlayer?.netData?.dead) return;}

            let maxR;
            let cx;
            let cy;

            if (state.isNadeDrawerEnabled){
                if (!me.container.nadeDrawer) {
                    me.container.nadeDrawer = new PIXI.Graphics();
                    me.container.addChild(me.container.nadeDrawer);
                }

                Object.values(window.game.objectCreator.idToObj)
                    .filter(obj => {
                    const isValid = ( obj.__type === 9 && obj.type !== "smoke" )
                    ||(
                        obj.smokeEmitter &&
                        window.objects[obj.type].explosion);
                    return isValid;
                })
                    .forEach(obj => {
                    let maxRadius = (window.explosions[
                        window.throwable[obj.type]?.explosionType ||
                        window.objects[obj.type].explosion
                    ].rad.max + 1) * 16;

                    maxR = (window.explosions[
                        window.throwable[obj.type]?.explosionType ||
                        window.objects[obj.type].explosion
                    ].rad.max + 1) * 16;

                    let centerX = (obj.pos.x - meX) * 16;
                    cx = (obj.pos.x - meX) * 16;
                    let centerY = (meY - obj.pos.y) * 16;
                    cy = (meY - obj.pos.y) * 16;
                    let numRings = 1;
                    for (let i = numRings; i >= 1; i--) {
                        let alpha = i / numRings * 0.3;
                        let radius = (i / numRings) * maxRadius;

                        nadeDrawer.beginFill(0xff0000, alpha);
                        nadeDrawer.drawCircle(centerX, centerY, radius);
                        nadeDrawer.endFill();

                    }

                });
            }

            if (state.isNadeDrawerEnabled){
                if (!me.container.nadeDrawer) {
                    me.container.nadeDrawer = new PIXI.Graphics();
                    me.container.addChild(me.container.nadeDrawer);
                }

                Object.values(window.game.objectCreator.idToObj)
                    .filter(obj => {
                    const isValid = ( obj.__type === 9 && obj.type !== "smoke" )
                    ||(
                        obj.smokeEmitter &&
                        window.objects[obj.type].explosion);
                    return isValid;
                })
                    .forEach(obj => {
                    let maxRadius = (window.explosions[
                        window.throwable[obj.type]?.explosionType ||
                        window.objects[obj.type].explosion
                    ].rad.max + 1) * 16;

                    maxR = (window.explosions[
                        window.throwable[obj.type]?.explosionType ||
                        window.objects[obj.type].explosion
                    ].rad.max + 1) * 16;

                    cx = (obj.pos.x - meX) * 16;
                    cy = (meY - obj.pos.y) * 16;

                    nadeDrawer.lineStyle(1, 0xff0000, 0.8);
                    nadeDrawer.drawCircle(cx, cy, maxR);
                    nadeDrawer.endFill();

                });
            }

            const laserDrawer = me.container.laserDrawer;
            try{laserDrawer.clear();}
            catch{if(!window.game?.ws || window.game?.activePlayer?.netData?.dead) return;}
            if (state.isLaserDrawerEnabled) {
                const curWeapon = findWeap(me);
                const curBullet = findBullet(curWeapon);

                if (!me.container.laserDrawer) {
                    me.container.laserDrawer = new PIXI.Graphics();
                    me.container.addChildAt(me.container.laserDrawer, 0);
                }
function laserPointer(
  curBullet,
  curWeapon,
  acPlayer,
  color = 0x0000ff,
  opacity = 0.3,
) {
  const { pos: acPlayerPos } = acPlayer;

  const dateNow = performance.now();

  if (!(acPlayer.__id in state.lastFrames)) state.lastFrames[acPlayer.__id] = [];
  state.lastFrames[acPlayer.__id].push([dateNow, { ...acPlayerPos }]);

  if (state.lastFrames[acPlayer.__id].length < 30) return;

  if (state.lastFrames[acPlayer.__id].length > 30) {
    state.lastFrames[acPlayer.__id].shift();
  }

  const deltaTime = (dateNow - state.lastFrames[acPlayer.__id][0][0]) / 1000;
  const acPlayerVelocity = {
    x: (acPlayerPos._x - state.lastFrames[acPlayer.__id][0][1]._x) / deltaTime,
    y: (acPlayerPos._y - state.lastFrames[acPlayer.__id][0][1]._y) / deltaTime,
  };

  let lasic = {};
  let isMoving = !!(acPlayerVelocity.x || acPlayerVelocity.y);

  if (curBullet) {
    lasic.active = true;
    lasic.range = curBullet.distance * 16.25;
    let atan;
    if (
      acPlayer == me &&
      ((!window.lastAimPos) ||
        (window.lastAimPos &&
          !(
            window.game.touch.shotDetected ||
            window.game.inputBinds.isBindDown(inputCommands.Fire)
          )))
    ) {
      atan = Math.atan2(
        window.game.input.mousePos._y - window.innerHeight / 2,
        window.game.input.mousePos._x - window.innerWidth / 2,
      );
    } else if (
      acPlayer == me &&
      window.lastAimPos &&
      (window.game.touch.shotDetected ||
        window.game.inputBinds.isBindDown(inputCommands.Fire))
    ) {
      const playerPointToScreen = window.game.camera.pointToScreen({
        x: acPlayer.pos._x,
        y: acPlayer.pos._y,
      });
      atan =
        Math.atan2(
          playerPointToScreen.y - window.lastAimPos.clientY,
          playerPointToScreen.x - window.lastAimPos.clientX,
        ) - Math.PI;
    } else {
      atan = Math.atan2(acPlayer.dir.x, acPlayer.dir.y) - Math.PI / 2;
    }
    lasic.direction = atan;
    lasic.angle =
      ((curWeapon.shotSpread + (isMoving ? curWeapon.moveSpread : 0)) * 0.01745329252) / 2;
  } else {
    lasic.active = false;
  }

  if (!lasic.active) {
    return;
  }

  const center = {
    x: (acPlayerPos._x - me.pos._x) * 16,
    y: (me.pos._y - acPlayerPos._y) * 16,
  };
  const radius = lasic.range;
  let angleFrom = lasic.direction - lasic.angle;
  let angleTo = lasic.direction + lasic.angle;
  angleFrom =
    angleFrom > Math.PI * 2
      ? angleFrom - Math.PI * 2
      : angleFrom < 0
        ? angleFrom + Math.PI * 2
        : angleFrom;
  angleTo =
    angleTo > Math.PI * 2
      ? angleTo - Math.PI * 2
      : angleTo < 0
        ? angleTo + Math.PI * 2
        : angleTo;
  laserDrawer.beginFill(color, opacity);
  laserDrawer.moveTo(center.x, center.y);
  laserDrawer.arc(center.x, center.y, radius, angleFrom, angleTo);
  laserDrawer.lineTo(center.x, center.y);
  laserDrawer.endFill();
}


                laserPointer(
                    curBullet,
                    curWeapon,
                    me,
                );

                players
                    .filter(player => player.active && !player.netData.dead && me.__id !== player.__id && me.layer === player.layer && getTeam(player) != meTeam)
                    .forEach(enemy => {
                    const enemyWeapon = findWeap(enemy);
                    laserPointer(
                        findBullet(enemyWeapon),
                        enemyWeapon,
                        enemy,
                        "0",
                        0.2,
                    );
                });
            };

        }catch(err){
        }
    }

    const ammo = [
        {
            name: "",
            ammo: null,
            lastShotDate: Date.now()
        },
        {
            name: "",
            ammo: null,
            lastShotDate: Date.now()
        },
        {
            name: "",
            ammo: null,
        },
        {
            name: "",
            ammo: null,
        },
    ];


    let qs = true;

    function autoSwitch() {

        if(qs){
            if (!(window.game?.ws && window.game?.activePlayer?.localData?.curWeapIdx != null)) {
                return;
            }

            try {
                const curWeapIdx = window.game.activePlayer.localData.curWeapIdx;
                const weaps = window.game.activePlayer.localData.weapons;
                const curWeap = weaps[curWeapIdx];
                if (!curWeap) {
                    return;
                }

                const shouldSwitch = (gun) => {
                    let s = false;
                    try {
                        s = (window.guns[gun]?.fireMode === "single" || window.guns[gun]?.fireMode === "burst") && window.guns[gun]?.fireDelay >= 0.45;
                    } catch (e) {
                        console.error("Error checking gun switch:", e);
                    }
                    return s;
                };

                const weapsEquip = ['EquipPrimary', 'EquipSecondary'];
                if (curWeap.ammo !== ammo[curWeapIdx]?.ammo) {
                    console.log("Ammo change detected for weapon index:", curWeapIdx);
                    const otherWeapIdx = (curWeapIdx === 0) ? 1 : 0;
                    const otherWeap = weaps[otherWeapIdx];
                    if (
                        (curWeap.ammo < ammo[curWeapIdx]?.ammo ||
                        (ammo[curWeapIdx]?.ammo === 0 && curWeap.ammo > ammo[curWeapIdx]?.ammo &&
                        (window.game.touch.shotDetected || window.game.inputBinds.isBindDown(inputCommands.Fire)))) &&
                        shouldSwitch(curWeap.type) &&
                        curWeap.type === ammo[curWeapIdx]?.type
                    ) {
                        ammo[curWeapIdx].lastShotDate = Date.now();
                        console.log("Switching weapon due to ammo change");
                        if (shouldSwitch(otherWeap.type) && otherWeap.ammo && !state.isUseOneGunEnabled) {
                            inputs.push(weapsEquip[otherWeapIdx]);
                        } else if (otherWeap.type !== "") {
                            inputs.push(weapsEquip[otherWeapIdx]);
                            inputs.push(weapsEquip[curWeapIdx]);
                        } else {
                            inputs.push('EquipMelee');
                            inputs.push(weapsEquip[curWeapIdx]);
                        }
                    }
                    ammo[curWeapIdx].ammo = curWeap.ammo;
                    ammo[curWeapIdx].type = curWeap.type;
                }

            } catch (err) {
                console.error('autoswitch', err);
            }
        }

    }

    function obstacleOpacity(){
        window.game.map.obstaclePool.pool.forEach(obstacle => {
            if (!['bush', 'tree', 'table', 'stairs'].some(substring => obstacle.type.includes(substring))) return;
            obstacle.sprite.alpha = state.isObstacleTransparent ? 0.45 : 1;
        });
    }


    let lastTime = Date.now();
    let showing = false;
    let timer = null;
    function grenadeTimer() {
       if (!(window.game?.ws && window.game?.activePlayer?.localData?.curWeapIdx != null && window.game?.activePlayer?.netData?.activeWeapon != null)) return;

       try {
           let elapsed = (Date.now() - lastTime) / 1000;
           const player = window.game.activePlayer;
           const activeItem = player.netData.activeWeapon;

           if (
               player.throwableState !== "cook" ||
               (!activeItem.includes('frag') && !activeItem.includes('mirv') && !activeItem.includes('martyr_nade'))
           ) {
               showing = false;
               if (timer) {
                   timer.destroy();
                   timer = null;
               }
               return;
           }

           const time = 4;
           if (elapsed > time) {
               showing = false;
           }
           if (!showing) {
               if (timer) {
                   timer.destroy();
               }
               timer = new window.pieTimerClass();
               window.game.pixi.stage.addChild(timer.container);
               timer.start("Grenade", 0, time);
               showing = true;
               lastTime = Date.now();
               return;
           }
           timer.update(elapsed - timer.elapsed, window.game.camera);
       } catch (err) {
           console.error('grenadeTimer', err);
       }
   }


    function isThrowingGrenade() {
        const me = window.game.activePlayer;
        if (!me || !me.netData) return false;

        const activeWeaponIndex = me.netData.curWeapIdx;
        const weapon = findWeap(me);
        return weapon && weapon.type === 'throwable';
    }


    function initTicker() {
        window.game.pixi._ticker.add(esp);
        window.game.pixi._ticker.add(autoSwitch);
        window.game.pixi._ticker.add(obstacleOpacity);
        window.game.pixi._ticker.add(grenadeTimer);
        window.game.pixi._ticker.add(aimBot);
        window.game.pixi._ticker.add(window.GameMod.startUpdateLoop.bind(window.GameMod));
    }

    let tickerOneTime = false;
    function initGame() {
        console.log('init game...........');

        window.lastAimPos = null;
        window.aimTouchMoveDir = null;
        state.enemyAimBot = true;
        state.focusedEnemy = true;
        state.friends = [];
        state.lastFrames = {};

        const tasks = [
            {isApplied: false, condition: () => window.game?.input?.mousePos && window.game?.touch?.aimMovement?.toAimDir, action: overrideMousePos},
            {isApplied: false, condition: () => window.game?.input?.mouseButtonsOld, action: bumpFire},
            {isApplied: false, condition: () => window.game?.activePlayer?.localData, action: betterZoom},
            {isApplied: false, condition: () => Array.prototype.push === window.game?.smokeBarn?.particles.push, action: smokeOpacity},
            {isApplied: false, condition: () => Array.prototype.push === window.game?.playerBarn?.playerPool?.pool.push, action: visibleNames},
            {isApplied: false, condition: () => window.game?.pixi?._ticker && window.game?.activePlayer?.container && window.game?.activePlayer?.pos, action: () => { if (!tickerOneTime) { tickerOneTime = true; initTicker(); } } },
        ];

        (function checkLocalData(){
            if(!window?.game?.ws) return;

            console.log('Checking local data');

            tasks.forEach(task => {
                if (task.isApplied || !task.condition()) return;
                task.action();
                task.isApplied = true;
            });

            if (tasks.some(task => !task.isApplied)) setTimeout(checkLocalData, 5);
            else console.log('All functions applied, stopping loop.');
        })();

        updateOverlay();
    }



    function bootLoader(){
        Object.defineProperty(window, 'game', {
            get () {
                return this._game;
            },
            set(value) {
                this._game = value;

                if (!value) return;

                initGame();
            }
        });
    }

    bootLoader();

})();
