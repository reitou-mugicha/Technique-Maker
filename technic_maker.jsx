(function () {
    var win = new Window("dialog", "Technique Maker");
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 12;
    win.margins = 20;

    var modes = {
        1: { name: "Flip", description: "反転を繰り返します。(例: 左右反転テクニックなど)" },
        2: { name: "Pingpong", description: "再生→逆再生を繰り返します。(例: 正面衝突テクニック, ドアテクなど)" },
        3: { name: "Scale", description: "拡大・縮小を繰り返します。" },
        4: { name: "Move", description: "ノーツに合わせて上下/左右に移動します。" }
    };

    var modePanel = win.add("panel", undefined, "Mode");
    modePanel.orientation = "column";
    modePanel.alignChildren = ["fill", "top"];
    modePanel.margins = [10, 15, 10, 10];
    modePanel.spacing = 6;
    var modeRadioGroup = modePanel.add("group");
    modeRadioGroup.orientation = "row";
    modeRadioGroup.spacing = 16;
    var modeDescText = modePanel.add("statictext", undefined, "", { multiline: false });
    modeDescText.preferredSize = [260, 30];

    var modeButtons = [];
    for (var key in modes) {
        (function (k) {
            var btn = modeRadioGroup.add("radiobutton", undefined, modes[k].name);
            btn.modeKey = parseInt(k);
            modeButtons.push(btn);
        })(key);
    }
    modeButtons[0].value = true;
    modeDescText.text = modes[1].description;

    var optPanel = win.add("panel", undefined, "Options");
    optPanel.orientation = "column";
    optPanel.alignChildren = ["fill", "top"];
    optPanel.margins = [10, 15, 10, 10];
    optPanel.spacing = 8;

    var flipGroup = optPanel.add("group");
    flipGroup.spacing = 10;
    flipGroup.add("statictext", undefined, "Axis:");
    var flipAxisX = flipGroup.add("radiobutton", undefined, "X");
    var flipAxisY = flipGroup.add("radiobutton", undefined, "Y");
    flipAxisX.value = true;

    var pingGroup = optPanel.add("group");
    pingGroup.spacing = 10;
    pingGroup.add("statictext", undefined, "Range (frames):");
    var pingInput = pingGroup.add("edittext", undefined, "12");
    pingInput.preferredSize = [60, 22];
    pingGroup.visible = false;

    var scaleGroup = optPanel.add("group");
    scaleGroup.orientation = "column";
    scaleGroup.alignChildren = ["fill", "top"];
    scaleGroup.spacing = 8;
    var scaleValGroup = scaleGroup.add("group");
    scaleValGroup.spacing = 10;
    scaleValGroup.add("statictext", undefined, "Max scale (%):");
    var scaleInput = scaleValGroup.add("edittext", undefined, "120");
    scaleInput.preferredSize = [60, 22];
    var scaleAxisGroup = scaleGroup.add("group");
    scaleAxisGroup.spacing = 10;
    scaleAxisGroup.add("statictext", undefined, "Axis:");
    var axisX = scaleAxisGroup.add("radiobutton", undefined, "X");
    var axisY = scaleAxisGroup.add("radiobutton", undefined, "Y");
    var axisXY = scaleAxisGroup.add("radiobutton", undefined, "XY");
    axisXY.value = true;
    scaleGroup.visible = false;

    var moveGroup = optPanel.add("group");
    moveGroup.orientation = "column";
    moveGroup.alignChildren = ["fill", "top"];
    moveGroup.spacing = 8;
    var moveDirGroup = moveGroup.add("group");
    moveDirGroup.spacing = 10;
    moveDirGroup.add("statictext", undefined, "Direction:");
    var moveDirH = moveDirGroup.add("radiobutton", undefined, "Horizontal");
    var moveDirV = moveDirGroup.add("radiobutton", undefined, "Vertical");
    moveDirH.value = true;
    var moveRangeGroup = moveGroup.add("group");
    moveRangeGroup.spacing = 10;
    moveRangeGroup.add("statictext", undefined, "Range (px):");
    var moveRangeInput = moveRangeGroup.add("edittext", undefined, "100");
    moveRangeInput.preferredSize = [60, 22];
    moveGroup.visible = false;

    function getCurrentMode() {
        for (var i = 0; i < modeButtons.length; i++) {
            if (modeButtons[i].value) return modeButtons[i].modeKey;
        }
        return 1;
    }

    function updateMode() {
        var m = getCurrentMode();
        modeDescText.text = modes[m].description;
        flipGroup.visible = (m === 1);
        pingGroup.visible = (m === 2);
        scaleGroup.visible = (m === 3);
        moveGroup.visible = (m === 4);
        win.layout.layout(true);
        win.update();
    }
    for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].onClick = updateMode;
    }

    var easePanel = win.add("panel", undefined, "Easing");
    easePanel.orientation = "row";
    easePanel.margins = [10, 15, 10, 10];
    easePanel.spacing = 16;
    var easeNone = easePanel.add("radiobutton", undefined, "None");
    var easeIn = easePanel.add("radiobutton", undefined, "In");
    var easeOut = easePanel.add("radiobutton", undefined, "Out");
    var easeIO = easePanel.add("radiobutton", undefined, "In/Out");
    easeNone.value = true;

    var bpmPanel = win.add("panel", undefined, "BPM");
    bpmPanel.orientation = "row";
    bpmPanel.margins = [10, 15, 10, 10];
    bpmPanel.spacing = 10;
    var bpmInput = bpmPanel.add("edittext", undefined, "165");
    bpmInput.preferredSize = [80, 22];

    var btnGroup = win.add("group");
    btnGroup.alignment = ["fill", "bottom"];
    btnGroup.alignChildren = ["right", "center"];
    btnGroup.spacing = 8;
    var cancelBtn = btnGroup.add("button", undefined, "Cancel", { name: "cancel" });
    cancelBtn.preferredSize = [80, 26];
    var runBtn = btnGroup.add("button", undefined, "Run", { name: "ok" });
    runBtn.preferredSize = [120, 26];

    cancelBtn.onClick = function () { win.close(); };

    runBtn.onClick = function () {
        var mode = getCurrentMode();
        var flipAxis = flipAxisX.value ? 1 : 2;
        var pingFrames = parseInt(pingInput.text) || 12;
        var scaleTarget = parseFloat(scaleInput.text) || 120;
        var scaleAxis = axisX.value ? 1 : axisY.value ? 2 : 3;
        var moveDir = moveDirH.value ? 1 : 2;
        var moveRange = parseFloat(moveRangeInput.text) || 100;
        var easingType = easeNone.value ? 0 : easeIn.value ? 1 : easeOut.value ? 2 : 3;
        var targetBpm = parseFloat(bpmInput.text) || 165;

        win.close();

        var midiFile = File.openDialog("MIDIファイルを選択 (*.mid)", "*.mid");
        if (!midiFile) return;

        midiFile.encoding = "BINARY";
        midiFile.open("r");
        var content = midiFile.read();
        midiFile.close();

        var data = [];
        for (var i = 0; i < content.length; i++) {
            data.push(content.charCodeAt(i) & 0xFF);
        }

        var comp = app.project.activeItem;
        var ticksPerBeat = (data[12] << 8) | data[13];
        var secPerTick = 60 / (targetBpm * ticksPerBeat);

        app.beginUndoGroup("MIDI Effect");

        var targetLayer = comp.selectedLayers[0];
        var layerIn = targetLayer.inPoint;
        var layerOut = targetLayer.outPoint;

        if (mode !== 3 && mode !== 4) {
            try {
                targetLayer.timeRemapEnabled = true;
            } catch (e) {
                alert("タイムリマップを有効にできませんでした。");
                app.endUndoGroup();
                return;
            }
        }

        var scaleProp = targetLayer.property("Transform").property("Scale");
        var posProp = targetLayer.property("Transform").property("Position");
        var timeProp = (mode !== 3 && mode !== 4) ? targetLayer.property("Time Remap") : null;

        if ((mode !== 3 && mode !== 4) && !timeProp) {
            alert("Time Remapプロパティが取得できませんでした。");
            app.endUndoGroup();
            return;
        }

        var trimStart = 0;
        var sourceEnd = 0;

        if (mode !== 3 && mode !== 4) {
            trimStart = targetLayer.inPoint - targetLayer.startTime;
            sourceEnd = timeProp.keyValue(timeProp.numKeys);
            timeProp.setValueAtTime(timeProp.keyTime(1), trimStart);
            timeProp.setValueAtTime(timeProp.keyTime(timeProp.numKeys), trimStart);
            while (timeProp.numKeys > 2) {
                timeProp.removeKey(timeProp.numKeys);
            }
        }

        var pingRangeSec = pingFrames / comp.frameRate;
        var trimEnd = trimStart + pingRangeSec;

        function applyEasingFn(prop, keyIndex) {
            if (easingType === 0) {
                prop.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.LINEAR);
            } else if (easingType === 1) {
                prop.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.LINEAR);
                prop.setTemporalEaseAtKey(keyIndex, [new KeyframeEase(0.5, 66)], [new KeyframeEase(0.5, 0.1)]);
            } else if (easingType === 2) {
                prop.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.LINEAR);
                prop.setTemporalEaseAtKey(keyIndex, [new KeyframeEase(0.5, 0.1)], [new KeyframeEase(0.5, 66)]);
            } else if (easingType === 3) {
                prop.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.BEZIER);
                var ease = new KeyframeEase(0.5, 66);
                prop.setTemporalEaseAtKey(keyIndex, [ease], [ease]);
            }
        }

        function setPingpongKeys(noteOnSec, noteOffSec, forward) {
            var noteDuration = noteOffSec - noteOnSec;
            var speed = pingRangeSec / noteDuration;
            var timePos = noteOnSec;
            var srcPos = forward ? trimStart : trimEnd;
            var dir = forward ? 1 : -1;
            timeProp.setValueAtTime(timePos, srcPos);
            var safetyCount = 0;
            while (timePos < noteOffSec - 0.0001 && safetyCount < 100) {
                safetyCount++;
                var distToEdge = dir > 0 ? (sourceEnd - srcPos) : (srcPos - trimStart);
                var timeToEdge = distToEdge / speed;
                var timeRemaining = noteOffSec - timePos;
                if (timeToEdge >= timeRemaining) {
                    srcPos = srcPos + dir * (speed * timeRemaining);
                    timePos = noteOffSec;
                    timeProp.setValueAtTime(timePos, srcPos);
                    break;
                } else {
                    timePos = timePos + timeToEdge;
                    srcPos = dir > 0 ? sourceEnd : trimStart;
                    timeProp.setValueAtTime(timePos, srcPos);
                    dir = -dir;
                }
            }
        }

        var p = 14;
        while (p < data.length) {
            if (String.fromCharCode(data[p], data[p + 1], data[p + 2], data[p + 3]) === "MTrk") {
                p += 8; break;
            }
            p++;
        }

        var currentTimeInTicks = 0;
        var notes = [];
        var activeNotes = {};

        while (p < data.length) {
            var delta = 0;
            while (true) {
                var b = data[p++];
                delta = (delta << 7) | (b & 0x7F);
                if (!(b & 0x80)) break;
            }
            currentTimeInTicks += delta;
            var status = data[p++];

            if ((status & 0xF0) === 0x90) {
                var note = data[p++];
                var velocity = data[p++];
                if (velocity > 0) {
                    activeNotes[note] = currentTimeInTicks;
                } else {
                    if (activeNotes[note] !== undefined) {
                        notes.push({ onTick: activeNotes[note], offTick: currentTimeInTicks });
                        delete activeNotes[note];
                    }
                }
            } else if ((status & 0xF0) === 0x80) {
                var note2 = data[p++]; p++;
                if (activeNotes[note2] !== undefined) {
                    notes.push({ onTick: activeNotes[note2], offTick: currentTimeInTicks });
                    delete activeNotes[note2];
                }
            } else if (status === 0xFF) { p++; var len = data[p++]; p += len; }
            else if ((status & 0xF0) === 0xB0 || (status & 0xF0) === 0xE0) { p += 2; }
            else if ((status & 0xF0) === 0xC0 || (status & 0xF0) === 0xD0) { p += 1; }
        }

        var isFlipped = false;
        var isPingForward = true;
        var lastNoteTime = -1;
        var basePosX = 0, basePosY = 0;

        if (mode === 4) {
            var basePos = posProp.valueAtTime(layerIn, false);
            basePosX = basePos[0];
            basePosY = basePos[1];
        }

        for (var n = 0; n < notes.length; n++) {
            var noteOnSec = notes[n].onTick * secPerTick + layerIn;
            var noteOffSec = notes[n].offTick * secPerTick + layerIn;
            if (noteOnSec > layerOut) break;

            if (mode === 1) {
                isFlipped = !isFlipped;
                if (flipAxis === 1) {
                    scaleProp.setValueAtTime(noteOnSec, [isFlipped ? -100 : 100, 100]);
                } else {
                    scaleProp.setValueAtTime(noteOnSec, [100, isFlipped ? -100 : 100]);
                }
                if (lastNoteTime !== -1 && noteOnSec > lastNoteTime) {
                    var elapsed = noteOnSec - lastNoteTime;
                    timeProp.setValueAtTime(noteOnSec - 0.001, trimStart + elapsed);
                }
                timeProp.setValueAtTime(noteOnSec, trimStart);
                lastNoteTime = noteOnSec;

            } else if (mode === 2) {
                setPingpongKeys(noteOnSec, noteOffSec, isPingForward);
                isPingForward = !isPingForward;

            } else if (mode === 3) {
                var isScaleUp = (n % 2 === 0);
                var startVal = isScaleUp ? 100 : scaleTarget;
                var endVal = isScaleUp ? scaleTarget : 100;
                var startScale = scaleAxis === 1 ? [startVal, scaleProp.valueAtTime(noteOnSec, false)[1]]
                    : scaleAxis === 2 ? [scaleProp.valueAtTime(noteOnSec, false)[0], startVal]
                        : [startVal, startVal];
                var endScale = scaleAxis === 1 ? [endVal, scaleProp.valueAtTime(noteOffSec, false)[1]]
                    : scaleAxis === 2 ? [scaleProp.valueAtTime(noteOffSec, false)[0], endVal]
                        : [endVal, endVal];
                scaleProp.setValueAtTime(noteOnSec, startScale);
                scaleProp.setValueAtTime(noteOffSec, endScale);

            } else if (mode === 4) {
                var half = moveRange / 2;
                var isGoPhase = (n % 2 === 0);
                var startPosVal, endPosVal;
                if (moveDir === 1) {
                    startPosVal = isGoPhase ? [basePosX - half, basePosY] : [basePosX + half, basePosY];
                    endPosVal = isGoPhase ? [basePosX + half, basePosY] : [basePosX - half, basePosY];
                } else {
                    startPosVal = isGoPhase ? [basePosX, basePosY - half] : [basePosX, basePosY + half];
                    endPosVal = isGoPhase ? [basePosX, basePosY + half] : [basePosX, basePosY - half];
                }
                posProp.setValueAtTime(noteOnSec, startPosVal);
                posProp.setValueAtTime(noteOffSec, endPosVal);
            }
        }

        if (mode === 1 && notes.length > 0 && lastNoteTime !== -1) {
            var lastNote = notes[notes.length - 1];
            var lastOffSec = lastNote.offTick * secPerTick + layerIn;
            var elapsed2 = lastOffSec - lastNoteTime;
            timeProp.setValueAtTime(lastOffSec, trimStart + elapsed2);
            targetLayer.outPoint = lastOffSec;
        }

        if (mode === 1) {
            for (var i = 1; i <= scaleProp.numKeys; i++) {
                scaleProp.setInterpolationTypeAtKey(i, KeyframeInterpolationType.HOLD);
            }
            for (var j = 1; j <= timeProp.numKeys; j++) {
                timeProp.setInterpolationTypeAtKey(j, KeyframeInterpolationType.LINEAR);
            }
        } else if (mode === 2) {
            for (var j = 1; j <= timeProp.numKeys; j++) {
                applyEasingFn(timeProp, j);
            }
        } else if (mode === 3) {
            for (var i = 1; i <= scaleProp.numKeys; i++) {
                applyEasingFn(scaleProp, i);
            }
        } else if (mode === 4) {
            for (var i = 1; i <= posProp.numKeys; i++) {
                applyEasingFn(posProp, i);
            }
        }

        app.endUndoGroup();
        alert("完了しました。");
    };

    win.show();
})();