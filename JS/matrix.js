let hasStrokeAsFilter = false;

class mainMatricesFilter {
    constructor(matrix) {
        this.matrix = matrix;
        this.div = matrix.div;
        this.x = this.matrix.width;
        this.y = 0;
        this.width = this.matrix.width * 9 / 22;
        this.height = (0.5 - this.matrix.getAngleRatio() / 2) * this.matrix.height;
        this.margin = this.width * 0.03;
        this.padding = this.width * 0.01;
        this.titleHeight = this.height / 25;
        this.itemHeight = (this.height - this.margin * 2 - this.padding * 29 - this.titleHeight * 4) / 22;
        this.listWidth = (this.width - this.margin * 2 - this.padding * 4) / 3;
        this.listHeight = this.itemHeight * 11 + this.titleHeight * 2 + this.padding * 14;
        this.inList = [{
            tech: new Array(10),
            pos: new Array(5),
            pla: new Array(9)
        }, {
            tech: new Array(10),
            pos: new Array(5),
            pla: new Array(9)
        }];
        for(let player of this.inList)
            for(let attr of ["tech", "pos", "pla"])
                for(let i = 0; i < player[attr].length; i++) player[attr][i] = 0;
        this.tagList = {
            tech: ["par","dro","cho","lob","cut","blo","fli","sma","loo","ser"],
            pos: ["sid","bac","for","ant","ser"],
            pla: ["bs","ms","fs","bh","mh","fh","bl","ml","fl"],
        };
        this.tagID = {
            tech: [22,23,24,25,26,27,28,29,30,31],
            pos: [13,14,15,16,17],
            pla: [0,1,2,3,4,5,6,7,8],
        };

        this.draw();
    }

    draw() {
        this.svg = this.div.append("svg").attr("style", `position:absolute;
                                                        left:${this.x}px;
                                                        top:${this.y}px;
                                                        width:${this.width}px;
                                                        height:${this.height}px`)
            .append("g").attr("id", "matrixFilter_g").attr("transform", `translate(0,0)`);
        this.drawBackground();
        this.players = new Array(2);
        this.drawPlayer(0);
        this.drawPlayer(1);
        // this.drawTrash();
    }

    drawBackground() {
        let Background = this.svg.append("g").attr("id", "matrixFilter_Background");
        let width = this.width, height = this.height, radius = 5, angle = 22.5;

        Background.append("path")
            .style("stroke-width", "0")
            .style("fill", "rgb(255,255,255)")
            .attr("d", `M${-radius} 0
                        L${width - radius} 0
                        Q${width} 0
                        ${width} ${radius}
                        L${width} ${height}                        
                        L${-radius} ${height}`);
        Background.append("path")
            .style("stroke-width", "0")
            .style("fill", "rgb(230,230,230)")
            .attr("d", mainMatricesFilter.getRect(this.margin / 2, this.margin / 2, this.width - this.margin, this.height - this.margin))
    }

    drawPlayer(player) {
        let p = this.svg.append("g").attr("id", "matrixFilter_Player" + player)
            .attr("transform", `translate(${this.margin}, ${this.margin + player * (this.listHeight + this.padding)})`);
        p.append("path")
            .style("stroke-width", "0").style("fill", "rgb(255,255,255)")
            .attr("d", mainMatricesFilter.getRect(0, 0, this.width - this.margin * 2, this.listHeight));
        p.append("path")
            .style("stroke-width", "0").style("fill", this.matrix.playerColor[player])
            .attr("d", mainMatricesFilter.getRect(0, 0, this.width - this.margin * 2, this.titleHeight));
        this.players[player] = new Array(4);
        this.players[player][3] = p.append("text")
            .attr("x", this.width / 2 - this.margin)
            .attr("y", this.titleHeight / 2)
            .attr("class", "player_font")
            .style("font-size", this.titleHeight)
            .text("P" + (player + 1));
        for (let [i, title] of ["tech", "pla", "pos"].entries()) {
            let attributeList = p.append("g").attr("transform", `translate(${this.padding * (i + 1) + this.listWidth * i},${this.titleHeight + this.padding})`);
            attributeList.append("path")
                .style("stroke-width", "0").style("fill", "rgb(230,230,230)")
                .attr("d", mainMatricesFilter.getRect(0, 0, this.listWidth, this.listHeight - this.titleHeight - this.padding * 2));
            attributeList.append("path")
                .style("stroke-width", "0").style("fill", this.matrix.playerColor[player])
                .attr("d", mainMatricesFilter.getRect(0, 0, this.listWidth, this.titleHeight));
            attributeList.append("text")
                .attr("x", this.listWidth / 2)
                .attr("y", this.titleHeight / 2)
                .attr("class", "player_font")
                .style("font-size", this.titleHeight)
                .text(title);
            this.players[player][i] = attributeList.append("g").attr("transform", `translate(0,${this.titleHeight})`);
            for(let [j, attr] of this.tagList[title].entries()) {
                let g = this.players[player][i].append("g")
                    .attr("id", `P${player}A${title}I${attr}`)
                    .attr("transform", `translate(0,${j*this.itemHeight+(j+1)*this.padding})`)
                    .attr("opacity", 0)
                    ;// .style("cursor", "pointer")
                    // .on("click", ()=>this.matrix.clickAttr({Player:player+1, List:[this.tagID[title][j]]}));
                this.addTag(g, attr, player);
            }
        }
    }

    drawTrash() {
        let t = this.svg.append("g").attr("id", "matrixFilter_Trash")
            .attr("transform", `translate(${this.margin}, ${this.margin + 2 * (this.listHeight + this.padding)})`)
            .style("cursor", "pointer")
            .on("click", () => {
                this.trashAll()
            });
        t.append("path")
            .attr("style", "stroke-width:0;fill:rgb(99,102,123);")
            .attr("d", mainMatricesFilter.getRect(0, 0, this.width - this.margin * 2, this.titleHeight));
        //draw trash can
        t.append("path")
            .attr("style", "stroke:rgb(255,255,255);stroke-width:2;")
            .attr("d", `M${this.width / 2 - this.margin - 1} ${this.titleHeight / 6}
                        L${this.width / 2 - this.margin + 1} ${this.titleHeight / 6}`);
        t.append("path")
            .attr("style", "stroke:rgb(255,255,255);stroke-width:2;")
            .attr("d", `M${this.width / 2 - this.margin - this.titleHeight / 2.5} ${this.titleHeight / 3}
                        L${this.width / 2 - this.margin + this.titleHeight / 2.5} ${this.titleHeight / 3}`)
        t.append("path")
            .attr("style", "stroke:rgb(255,255,255);stroke-width:2;")
            .attr("d", `M${this.width / 2 - this.margin - this.titleHeight / 4} ${this.titleHeight / 2}
                        L${this.width / 2 - this.margin - this.titleHeight / 5} ${this.titleHeight * 5 / 6}
                        L${this.width / 2 - this.margin + this.titleHeight / 5} ${this.titleHeight * 5 / 6}
                        L${this.width / 2 - this.margin + this.titleHeight / 4} ${this.titleHeight / 2}`)
    }

    static getRect(x, y, width, height, radius) {
        if (radius === undefined) radius = 5;
        return `M${x + width - radius} ${y}
                Q${x + width} ${y} ${x + width} ${y + radius}
                L${x + width} ${y + height - radius}
                Q${x + width} ${y + height} ${x + width - radius} ${y + height}
                L${x + radius} ${y + height}
                Q${x} ${y + height} ${x} ${y + height - radius}
                L${x} ${y + radius}
                Q${x} ${y} ${x + radius} ${y}
                Z`;
    }

    addTag(rootGroup, context, player) {
        rootGroup.append("path")
            .style("stroke-width", "1")
            .style("stroke", this.matrix.playerColor[player])
            .style("fill", "rgb(255,255,255)")
            .attr("d", mainMatricesFilter.getRect(this.padding * 2, this.padding, this.listWidth - this.padding * 4, this.itemHeight));
        rootGroup.append("text")
            .attr("x", this.listWidth / 2)
            .attr("y", this.padding + this.itemHeight / 2)
            .attr("class", "player_font")
            // .style("cursor", "pointer")
            .style("cursor", "default")
            .style("fill", this.matrix.playerColor[player])
            .style("font-size", this.itemHeight)
            .text(context);
    }

    trashAll() {
        this.matrix.deChoose();
    }

    refresh() {
        let msg = this.matrix.getMsg();

        for (let i of [0, 1])
            this.players[i][3].text(`p${i + 1} : ${msg["p" + (i + 1)]}`);

        let time = 0, flag;
        const duration = 50;
        // remove
        flag = false;
        for(let player of [0, 1])
            for(let [i, attr] of ["tech", "pla", "pos"].entries()) {
                for(let [j, item] of this.tagList[attr].entries())
                    if(msg.chosen[player][attr][j] === 0 && this.inList[player][attr][j] === 1) {
                        flag = true;
                        this.players[player][i].select(`#P${player}A${attr}I${item}`)
                            .transition().duration(duration)
                            .attr("opacity", 0)
                    }
            }
        if(flag) time += duration;
        // transform
        setTimeout(()=>{
            flag = false;
            for(let player of [0, 1])
                for(let [i, attr] of ["tech", "pla", "pos"].entries()) {
                    let offset = this.padding;
                    for(let [j, item] of this.tagList[attr].entries())
                        if(msg.chosen[player][attr][j] === 1) {
                            if(this.inList[player][attr][j] === 1) flag = true;
                            this.players[player][i].select(`#P${player}A${attr}I${item}`)
                                .transition().duration(duration)
                                .attr("transform", `translate(0,${offset})`);
                            offset += (this.padding+this.itemHeight);
                        }
                    for(let [j, item] of this.tagList[attr].entries())
                        if(msg.chosen[player][attr][j] === 0) {
                            // flag = true;
                            this.players[player][i].select(`#P${player}A${attr}I${item}`)
                                .transition().duration(duration)
                                .attr("transform", `translate(0,${offset})`);
                            offset += (this.padding+this.itemHeight);
                        }
                }
            if(flag) time += duration;
            // add new
            setTimeout(()=>{
                for(let player of [0, 1])
                    for(let [i, attr] of ["tech", "pla", "pos"].entries()) {
                        for(let [j, item] of this.tagList[attr].entries()) {
                            if (msg.chosen[player][attr][j] === 1 && this.inList[player][attr][j] === 0) {
                                console.log(`#P${player}A${attr}I${item}`, i);
                                this.players[player][i].select(`#P${player}A${attr}I${item}`)
                                    .transition().delay(time).duration(duration)
                                    .attr("opacity", 1)
                            }
                        }
                    }

                this.inList = JSON.parse(JSON.stringify(msg.chosen));
            }, time+10);
        }, time+10);
    }
}

class mainMatrices {
    constructor() {
        this.div = d3.select("#MATRIX");
        this.width = +document.getElementById("MATRIX").getBoundingClientRect().width;
        this.height = +document.getElementById("MATRIX").getBoundingClientRect().height;
        this.svg = this.div.append("svg").style("width", "150%").style("height", "100%")
            .append("g").attr("id", "matrix_g").attr("transform", `translate(0,${this.height / 2})`);

        this.initData();
        this.initParams();
        this.filter = new mainMatricesFilter(this);
        this.draw();
        this.initAttr();
        this.rechoosePlayer(0);
    }

    getMsg() {
        let that = this;

        function getState(player) {
            if (that.matrixList[0].isLocked) return "Equal";
            if (that.mainPlayer === player) return "Current";
            if (that.playerID[that.frontSide] === player) return "Previous";
            return "Next";
        }
        function getChosen() {
            let rtn = JSON.parse(JSON.stringify(that.isChoosed));
            if(that.bridgeList[0].isChosen === false) rtn[0].pla.forEach((v,i,a)=>a[i]=0);
            if(that.bridgeList[3].isChosen === false) rtn[0].pos.forEach((v,i,a)=>a[i]=0);
            if(that.bridgeList[2].isChosen === false) rtn[0].tech.forEach((v,i,a)=>a[i]=0);
            if(that.bridgeList[4].isChosen === false) rtn[1].pla.forEach((v,i,a)=>a[i]=0);
            if(that.bridgeList[7].isChosen === false) rtn[1].pos.forEach((v,i,a)=>a[i]=0);
            if(that.bridgeList[6].isChosen === false) rtn[1].tech.forEach((v,i,a)=>a[i]=0);
            return rtn;
        }

        return {
            p1: getState(0),
            p2: getState(1),
            chosen: getChosen(),
        };
    }

    initData() {
        this.plaGroup = [
            {
                "Name": "short",
                "uniqueID": 9,
                "List": [
                    {
                        "Name": "backhand",
                        "uniqueID": 0,
                        "branchID": 0,
                        "dataID": 0
                    },
                    {
                        "Name": "middle",
                        "uniqueID": 1,
                        "branchID": 1,
                        "dataID": 1
                    },
                    {
                        "Name": "forehand",
                        "uniqueID": 2,
                        "branchID": 2,
                        "dataID": 2
                    }
                ]
            },
            {
                "Name": "half long",
                "uniqueID": 10,
                "List": [
                    {
                        "Name": "backhand",
                        "uniqueID": 3,
                        "branchID": 3,
                        "dataID": 3
                    },
                    {
                        "Name": "middle",
                        "uniqueID": 4,
                        "branchID": 4,
                        "dataID": 4
                    },
                    {
                        "Name": "forehand",
                        "uniqueID": 5,
                        "branchID": 5,
                        "dataID": 5
                    }
                ]
            },
            {
                "Name": "long",
                "uniqueID": 11,
                "List": [
                    {
                        "Name": "backhand",
                        "uniqueID": 6,
                        "branchID": 6,
                        "dataID": 6
                    },
                    {
                        "Name": "middle",
                        "uniqueID": 7,
                        "branchID": 7,
                        "dataID": 7
                    },
                    {
                        "Name": "forehand",
                        "uniqueID": 8,
                        "branchID": 8,
                        "dataID": 8
                    }
                ]
            }
        ];
        this.techGroup = [
            {
                "Name": "control",
                "uniqueID": 32,
                "List": [
                    {
                        "Name": "parrel",
                        "uniqueID": 22,
                        "branchID": 0,
                        "dataID": 8
                    },
                    {
                        "Name": "drop shot",
                        "uniqueID": 23,
                        "branchID": 1,
                        "dataID": 5
                    },
                    {
                        "Name": "chop long",
                        "uniqueID": 24,
                        "branchID": 2,
                        "dataID": 4
                    }
                ]
            },
            {
                "Name": "defend",
                "uniqueID": 33,
                "List": [
                    {
                        "Name": "lob",
                        "uniqueID": 25,
                        "branchID": 3,
                        "dataID": 9
                    },
                    {
                        "Name": "cut",
                        "uniqueID": 26,
                        "branchID": 4,
                        "dataID": 7
                    },
                    {
                        "Name": "block",
                        "uniqueID": 27,
                        "branchID": 5,
                        "dataID": 6
                    }
                ]
            },
            {
                "Name": "attack",
                "uniqueID": 34,
                "List": [
                    {
                        "Name": "flick",
                        "uniqueID": 28,
                        "branchID": 6,
                        "dataID": 3
                    },
                    {
                        "Name": "smash",
                        "uniqueID": 29,
                        "branchID": 7,
                        "dataID": 2
                    },
                    {
                        "Name": "loop",
                        "uniqueID": 30,
                        "branchID": 8,
                        "dataID": 1
                    }
                ]
            },
            {
                "Name": "serve",
                "uniqueID": 35,
                "List": [
                    {
                        "Name": "serve",
                        "uniqueID": 31,
                        "branchID": 9,
                        "dataID": 0
                    }
                ]
            }
        ];
        this.posGroup = [
            {
                "Name": "backhand area",
                "uniqueID": 18,
                "List": [
                    {
                        "Name": "sideways",
                        "uniqueID": 13,
                        "branchID": 0,
                        "dataID": 4
                    },
                    {
                        "Name": "backhand",
                        "uniqueID": 14,
                        "branchID": 1,
                        "dataID": 3
                    }
                ]
            },
            {
                "Name": "forehand area",
                "uniqueID": 19,
                "List": [
                    {
                        "Name": "forehand",
                        "uniqueID": 15,
                        "branchID": 2,
                        "dataID": 2
                    },
                    {
                        "Name": "anti-sideways",
                        "uniqueID": 16,
                        "branchID": 3,
                        "dataID": 1
                    }
                ]
            },
            {
                "Name": "serve",
                "uniqueID": 20,
                "List": [
                    {
                        "Name": "serve",
                        "uniqueID": 17,
                        "branchID": 4,
                        "dataID": 0
                    }
                ]
            }
        ];

        this.plaNum = [this.plaGroup.length,
            this.plaGroup[this.plaGroup.length - 1].List[this.plaGroup[this.plaGroup.length - 1].List.length - 1].branchID + 1];
        this.techNum = [this.techGroup.length,
            this.techGroup[this.techGroup.length - 1].List[this.techGroup[this.techGroup.length - 1].List.length - 1].branchID + 1];
        this.posNum = [this.posGroup.length,
            this.posGroup[this.posGroup.length - 1].List[this.posGroup[this.posGroup.length - 1].List.length - 1].branchID + 1];

        this.reconstructData = new Array(7);
        this.mergeData = new Array(7);
        this.lastMsg = "";
    }

    initParams() {
        this.matrixList = new Array(7);
        this.bridgeList = new Array(10);
        this.playerList = new Array(2);

        this.leftPadding = this.width * 0.03;
        this.topPadding = this.bottomPadding = this.height * 0.01;
        this.gridSize = this.height * 0.015;
        this.gridSpace = this.gridSize * 0.4;
        this.playerSize = 1 - Math.sqrt(2) / 2;
        this.playerSpace = this.height * 0.09;
        this.bgWidth = this.width * 0.02;
        this.bgBorder = 0;// this.width * 0.022;
        this.bgRadius = 5;

        this.plaLength = this.gridSpace * this.plaNum[0] + this.gridSize * this.plaNum[1];
        this.techLength = this.gridSpace * this.techNum[0] + this.gridSize * this.techNum[1];
        this.posLength = this.gridSpace * this.posNum[0] + this.gridSize * this.posNum[1];
        this.tagSize = (this.height
            - this.gridSize * 2
            - this.gridSpace * 8
            - this.plaLength * 2
            - this.techLength * 2
            - this.playerSpace
            - this.topPadding
            - this.bottomPadding) / 4;
        this.bridgeLength = this.gridSize * 1 + this.gridSpace * 4 + 2 * this.tagSize;
        this.switchBtnParams = {
            "pos": this.leftPadding*0.5,
            "width": this.plaLength * this.playerSize * 2.3,
            "height": (this.gridSpace * 2 + this.gridSize + this.tagSize) * 5 / 8,
            "rad": (this.gridSpace * 2 + this.gridSize + this.tagSize) / 16
        };
        this.orderBtnParams = {
            "pos": this.switchBtnParams.pos+this.switchBtnParams.width+this.leftPadding,
            "width": this.plaLength * this.playerSize * 2,
            "height": (this.gridSpace * 2 + this.gridSize + this.tagSize) / 2,
            "rad": (this.gridSpace * 2 + this.gridSize + this.tagSize) / 16
        };
        this.lockBtnParams = {
            "pos": this.orderBtnParams.pos+this.orderBtnParams.width+this.leftPadding*0.5,
            "width": this.plaLength * this.playerSize * 1.5,
            "height": (this.gridSpace * 2 + this.gridSize + this.tagSize) * 3 / 8,
            "rad": (this.gridSpace * 2 + this.gridSize + this.tagSize) *3 / 16
        };
        this.hintCursorDis = this.gridSize;
        this.hintCursorSize = this.gridSize * 0.8;
        this.hintSize = this.gridSize * 6;
        this.hintFont = this.gridSize / 1.2;

        this.playerID = [0, 1];
        this.frontSide = 0;
        this.playerColor = ["rgb(106,202,202)", "rgb(225, 157, 90)", "rgb(128,128,128)"];

        this.dataLock = false;
        this.pressControl = false;

        this.codingMode = 0;
    }

    initAttr() {
        this.isHovered = [{
            pla: this.bridgeList[0].isHovered,
            pos: this.bridgeList[3].isHovered,
            tech: this.bridgeList[2].isHovered
        }, {
            pla: this.bridgeList[4].isHovered,
            pos: this.bridgeList[7].isHovered,
            tech: this.bridgeList[6].isHovered
        }];
        this.isChoosed = [{
            pla: this.bridgeList[0].isChoosed,
            pos: this.bridgeList[3].isChoosed,
            tech: this.bridgeList[2].isChoosed
        }, {
            pla: this.bridgeList[4].isChoosed,
            pos: this.bridgeList[7].isChoosed,
            tech: this.bridgeList[6].isChoosed
        }];
        this.isMerged = [{
            pla: this.bridgeList[0].isMerged,
            pos: this.bridgeList[3].isMerged,
            tech: this.bridgeList[2].isMerged
        }, {
            pla: this.bridgeList[4].isMerged,
            pos: this.bridgeList[7].isMerged,
            tech: this.bridgeList[6].isMerged
        }];
    }

    refreshData(refreshParams) {
        if (this.dataLock) return;

        //region p0&p1
        let params = {
            last: this.mainPlayer === this.playerID[this.frontSide] ? null : this.frontSide,
            current: this.mainPlayer === this.playerID[this.frontSide] ? this.frontSide : 1 - this.frontSide,
            next: this.mainPlayer === this.playerID[this.frontSide] ? 1 - this.frontSide : null,
            player: this.mainPlayer,
        };
        let data = this.searchData(params);
        //region matrix0
        for (let i0 of this.plaGroup)
            for (let j0 of i0.List)
                for (let i1 of this.plaGroup)
                    for (let j1 of i1.List) {
                        let count = 0, win = 0, change = 0;
                        let recordPos = null, recordTech = null;
                        let lastPla = this.mainPlayer === this.playerID[this.frontSide] ? -1 : j0.dataID,
                            currentPla = this.mainPlayer === this.playerID[this.frontSide] ? j0.dataID : j1.dataID,
                            nextPla = this.mainPlayer === this.playerID[this.frontSide] ? j1.dataID : -1;
                        for (let k of data) {
                            if (k.pla === currentPla &&
                                (k.lastPla === lastPla || lastPla === -1) &&
                                (k.nextPla === nextPla || nextPla === -1)) count++;
                            else continue;
                            if (k.win === 1) win++;
                            if (recordPos !== null && (recordPos !== k.pos || recordTech !== k.tech)) change++;
                            recordPos = k.pos;
                            recordTech = k.tech;
                        }

                        this.reconstructData[0][j0.branchID][j1.branchID].count = count;
                        this.reconstructData[0][j0.branchID][j1.branchID].win = win;
                        this.reconstructData[0][j0.branchID][j1.branchID].change = change;
                    }
        //endregion
        //endregion

        //region p0
        params = this.frontSide === 0 ? {
            last: null,
            current: 0,
            next: this.matrixList[0].isLocked === 1 ? null : 1,
            player: this.playerID[0]
        } : {
            last: this.matrixList[0].isLocked === 1 ? null : 1,
            current: 0,
            next: null,
            player: this.playerID[0]
        };
        data = this.searchData(params);
        //region matrix1
        for (let i0 of this.posGroup)
            for (let j0 of i0.List)
                for (let i1 of this.techGroup)
                    for (let j1 of i1.List) {
                        let count = 0, win = 0, change = 0;
                        let recordPla = null;
                        let pos = j0.dataID, tech = j1.dataID;
                        for (let k of data) {
                            if (k.pos === pos && k.tech === tech) count++;
                            else continue;
                            if (k.win === 1) win++;
                            if (recordPla !== null && (recordPla !== k.pla)) change++;
                            recordPla = k.pla;
                        }

                        this.reconstructData[1][j0.branchID][j1.branchID].count = count;
                        this.reconstructData[1][j0.branchID][j1.branchID].win = win;
                        this.reconstructData[1][j0.branchID][j1.branchID].change = change;
                    }
        //endregion
        //region matrix2
        for (let i0 of this.plaGroup)
            for (let j0 of i0.List)
                for (let i1 of this.techGroup)
                    for (let j1 of i1.List) {
                        let count = 0, win = 0, change = 0;
                        let recordPos = null;
                        let pla = j0.dataID, tech = j1.dataID;
                        for (let k of data) {
                            if (k.pla === pla && k.tech === tech) count++;
                            else continue;
                            if (k.win === 1) win++;
                            if (recordPos !== null && (recordPos !== k.pos)) change++;
                            recordPos = k.pos;
                        }

                        this.reconstructData[2][j0.branchID][j1.branchID].count = count;
                        this.reconstructData[2][j0.branchID][j1.branchID].win = win;
                        this.reconstructData[2][j0.branchID][j1.branchID].change = change;
                    }
        //endregion
        //region matrix3
        for (let i0 of this.posGroup)
            for (let j0 of i0.List)
                for (let i1 of this.plaGroup)
                    for (let j1 of i1.List) {
                        let count = 0, win = 0, change = 0;
                        let recordTech = null;
                        let pos = j0.dataID, pla = j1.dataID;
                        for (let k of data) {
                            if (k.pos === pos && k.pla === pla) count++;
                            else continue;
                            if (k.win === 1) win++;
                            if (recordTech !== null && (recordTech !== k.tech)) change++;
                            recordTech = k.tech;
                        }

                        this.reconstructData[3][j0.branchID][j1.branchID].count = count;
                        this.reconstructData[3][j0.branchID][j1.branchID].win = win;
                        this.reconstructData[3][j0.branchID][j1.branchID].change = change;
                    }
        //endregion
        //endregion

        //region p1
        params = this.frontSide === 0 ? {
            last: this.matrixList[0].isLocked === 1 ? null : 0,
            current: 1,
            next: null,
            player: this.playerID[1]
        } : {
            last: null,
            current: 1,
            next: this.matrixList[0].isLocked === 1 ? null : 0,
            player: this.playerID[1]
        };
        data = this.searchData(params);
        //region matrix4
        for (let i0 of this.posGroup)
            for (let j0 of i0.List)
                for (let i1 of this.techGroup)
                    for (let j1 of i1.List) {
                        let count = 0, win = 0, change = 0;
                        let recordPla = null;
                        let pos = j0.dataID, tech = j1.dataID;
                        for (let k of data) {
                            if (k.pos === pos && k.tech === tech) count++;
                            else continue;
                            if (k.win === 1) win++;
                            if (recordPla !== null && (recordPla !== k.pla)) change++;
                            recordPla = k.pla;
                        }

                        this.reconstructData[4][j0.branchID][j1.branchID].count = count;
                        this.reconstructData[4][j0.branchID][j1.branchID].win = win;
                        this.reconstructData[4][j0.branchID][j1.branchID].change = change;
                    }
        //endregion
        //region matrix5
        for (let i0 of this.plaGroup)
            for (let j0 of i0.List)
                for (let i1 of this.techGroup)
                    for (let j1 of i1.List) {
                        let count = 0, win = 0, change = 0;
                        let recordPos = null;
                        let pla = j0.dataID, tech = j1.dataID;
                        for (let k of data) {
                            if (k.pla === pla && k.tech === tech) count++;
                            else continue;
                            if (k.win === 1) win++;
                            if (recordPos !== null && (recordPos !== k.pos)) change++;
                            recordPos = k.pos;
                        }

                        this.reconstructData[5][j0.branchID][j1.branchID].count = count;
                        this.reconstructData[5][j0.branchID][j1.branchID].win = win;
                        this.reconstructData[5][j0.branchID][j1.branchID].change = change;
                    }
        //endregion
        //region matrix6
        for (let i0 of this.posGroup)
            for (let j0 of i0.List)
                for (let i1 of this.plaGroup)
                    for (let j1 of i1.List) {
                        let count = 0, win = 0, change = 0;
                        let recordTech = null;
                        let pos = j0.dataID, pla = j1.dataID;
                        for (let k of data) {
                            if (k.pos === pos && k.pla === pla) count++;
                            else continue;
                            if (k.win === 1) win++;
                            if (recordTech !== null && (recordTech !== k.tech)) change++;
                            recordTech = k.tech;
                        }

                        this.reconstructData[6][j0.branchID][j1.branchID].count = count;
                        this.reconstructData[6][j0.branchID][j1.branchID].win = win;
                        this.reconstructData[6][j0.branchID][j1.branchID].change = change;
                    }
        //endregion
        //endregion

        //region calculate max
        //region single grid
        let max = 0;
        for (let i of this.reconstructData)
            for (let j of i)
                for (let k of j) max = Math.max(max, k.count);
        //endregion
        //region merge grid
        for (let i = 0; i < this.reconstructData.length; i++) {
            let xNum = 0, yNum = 0, XisMerged, YisMerged;
            switch (i) {
                case 0:
                    xNum = this.plaNum[1];
                    XisMerged = this.isMerged[0].pla;
                    yNum = this.plaNum[1];
                    YisMerged = this.isMerged[1].pla;
                    break;
                case 1:
                    xNum = this.posNum[1];
                    XisMerged = this.isMerged[0].pos;
                    yNum = this.techNum[1];
                    YisMerged = this.isMerged[0].tech;
                    break;
                case 2:
                    xNum = this.plaNum[1];
                    XisMerged = this.isMerged[0].pla;
                    yNum = this.techNum[1];
                    YisMerged = this.isMerged[0].tech;
                    break;
                case 3:
                    xNum = this.posNum[1];
                    XisMerged = this.isMerged[0].pos;
                    yNum = this.plaNum[1];
                    YisMerged = this.isMerged[0].pla;
                    break;
                case 4:
                    xNum = this.posNum[1];
                    XisMerged = this.isMerged[1].pos;
                    yNum = this.techNum[1];
                    YisMerged = this.isMerged[1].tech;
                    break;
                case 5:
                    xNum = this.plaNum[1];
                    XisMerged = this.isMerged[1].pla;
                    yNum = this.techNum[1];
                    YisMerged = this.isMerged[1].tech;
                    break;
                case 6:
                    xNum = this.posNum[1];
                    XisMerged = this.isMerged[1].pos;
                    yNum = this.plaNum[1];
                    YisMerged = this.isMerged[1].pla;
                    break;
            }
            for (let j = 0; j < xNum; j++) resetData(this.mergeData[i].x[j]);
            for (let k = 0; k < yNum; k++) resetData(this.mergeData[i].y[k]);
            resetData(this.mergeData[i].all);
            for (let j = 0; j < xNum; j++)
                for (let k = 0; k < yNum; k++) {
                    if (XisMerged[j] === 1) addData(this.mergeData[i].y[k], this.reconstructData[i][j][k]);
                    if (YisMerged[k] === 1) addData(this.mergeData[i].x[j], this.reconstructData[i][j][k]);
                    if (XisMerged[j] === 1 && YisMerged[k] === 1)
                        addData(this.mergeData[i].all, this.reconstructData[i][j][k]);
                    max = Math.max(max, this.mergeData[i].y[k].count);
                    max = Math.max(max, this.mergeData[i].x[j].count);
                    max = Math.max(max, this.mergeData[i].all.count);
                }
        }
        //endregion
        //region refresh
        for (let i of this.reconstructData)
            for (let j of i)
                for (let k of j) k.max = max;
        for (let i of this.mergeData) {
            for (let j of i.x) j.max = max;
            for (let j of i.y) j.max = max;
            i.all.max = max;
        }
        //endregion
        //endregion

        for (let i = 0; i < 7; i++)
            this.matrixList[i].refreshData();

        if(refreshParams === undefined || refreshParams.transfer === true)
            this.transferData();

        function resetData(data) {
            data.count = 0;
            data.win = 0;
            data.change = 0;
        }

        function addData(sum, adder) {
            sum.count += adder.count;
            sum.win += adder.win;
            sum.change += adder.change;
        }
    }

    searchData(params) {
        let player = params.player,
            current = params.current,
            last = params.last,
            next = params.next;

        let data = GLOBAL_DATA.data;
        let ans = new Array();
        let that = this;
        let lastChosen = last === null ? false : chooseSomething(last),
            currentChosen = current === null ? false : chooseSomething(current),
            nextChosen = next === null ? false : chooseSomething(next);

        if (hasStrokeAsFilter) {
            for (let game of data)
                for (let score of game)
                    for (let [i, stroke] of score.strokes.entries())
                        if (stroke.hitplayer === player &&
                            (match(stroke, current) || !currentChosen) &&
                            (last === null || (i > 0 && (match(score.strokes[i - 1], last) || !lastChosen))) &&
                            (next === null || (i < score.strokes.length - 1 && (match(score.strokes[i + 1], next) || !nextChosen)))) {
                            ans.push({
                                lastPla: stroke.last_ballpos,
                                nextPla: i < score.strokes.length - 1 ? score.strokes[i + 1].ballpos : -1,
                                pla: stroke.ballpos,
                                pos: stroke.pos,
                                tech: stroke.tech,
                                win: i !== score.strokes.length - 2 ? stroke.win : (score.strokes[i + 1].win === 0 ? 1 : -1)
                            });
                        }
        } else {
            for (let game of data)
                for (let score of game)
                    for (let [i, stroke] of score.strokes.entries())
                        if (stroke.hitplayer === player &&
                            (!currentChosen || match(stroke, current)) &&
                            (!lastChosen || (i > 0 && match(score.strokes[i - 1], last))) &&
                            (!nextChosen || (i < score.strokes.length - 1 && match(score.strokes[i + 1], next)))) {
                            ans.push({
                                lastPla: stroke.last_ballpos,
                                nextPla: i < score.strokes.length - 1 ? score.strokes[i + 1].ballpos : -1,
                                pla: stroke.ballpos,
                                pos: stroke.pos,
                                tech: stroke.tech,
                                win: i !== score.strokes.length - 2 ? stroke.win : (score.strokes[i + 1].win === 0 ? 1 : -1)
                            });
                        }
        }

        return ans;

        function chooseSomething(side) {
            return that.bridgeList[side * 4 + 1].isChosen || that.bridgeList[side * 4 + 2].isChosen || that.bridgeList[side * 4 + 3].isChosen;
            // for(let attr of ["pla","pos","tech"]) {
            //     let choose = that.isChoosed[side][attr],
            //         merge = that.isMerged[side][attr];
            //
            //     for(let i = 0; i < choose.length; i++)
            //         if(choose[i] === 0) return false;
            //     for(let i = 0; i < choose.length; i++)
            //         if(merge[i] === 1) return false;
            // }
            // return true;
        }

        function match(stroke, player) {
            let pla = stroke.ballpos, pos = stroke.pos, tech = stroke.tech;
            let flag;
            flag = false;
            for (let i of that.plaGroup)
                for (let j of i.List)
                    if (pla === j.dataID) {
                        flag = true;
                        if (that.isChoosed[player].pla[j.branchID] === 0) return false;
                    }
            if (!flag) return false;
            flag = false;
            for (let i of that.posGroup)
                for (let j of i.List)
                    if (pos === j.dataID) {
                        flag = true;
                        if (that.isChoosed[player].pos[j.branchID] === 0) return false;
                    }
            if (!flag) return false;
            flag = false;
            for (let i of that.techGroup)
                for (let j of i.List)
                    if (tech === j.dataID) {
                        flag = true;
                        if (that.isChoosed[player].tech[j.branchID] === 0) return false;
                    }
            return flag;
        }
    }

    transferData() {
        this.filter.refresh();
        let that = this;
        let msg = {
            "player0": {
                "display": 0
            },
            "player1": {
                "display": 0
            },
            "player0&player1": {
                "display": 0
            }
        };
        if (this.matrixList[0].isLocked === 1) {
            let p = msg["player0&player1"];
            p.display = 1;
            p.tech0 = transmit(this.frontSide, "tech");
            p.tech1 = transmit(1 - this.frontSide, "tech");
            p.pos0 = transmit(this.frontSide, "pos");
            p.pos1 = transmit(1 - this.frontSide, "pos");
            p.ballpos0 = transmit(this.frontSide, "pla");
            p.ballpos1 = transmit(1 - this.frontSide, "pla");
        } else {
            let p = msg[`player${this.mainPlayer}`];
            p.display = 1;
            p.prior = {filter: 0};
            p.current = {filter: 1};
            p.next = {filter: 0};

            if (this.mainPlayer === this.playerID[this.frontSide]) {
                p.current.tech = transmit(this.frontSide, "tech");
                p.current.pos = transmit(this.frontSide, "pos");
                p.current.ballpos = transmit(this.frontSide, "pla");

                if (this.bridgeList[5 - this.frontSide * 4].isChosen || this.bridgeList[6 - this.frontSide * 4].isChosen || this.bridgeList[7 - this.frontSide * 4].isChosen) {
                    p.next.filter = 1;
                    p.next.tech = transmit(1 - this.frontSide, "tech");
                    p.next.pos = transmit(1 - this.frontSide, "pos");
                    p.next.ballpos = transmit(1 - this.frontSide, "pla");
                } else p.next.filter = 0;
            } else {
                p.current.tech = transmit(1 - this.frontSide, "tech");
                p.current.pos = transmit(1 - this.frontSide, "pos");
                p.current.ballpos = transmit(1 - this.frontSide, "pla");

                if (this.bridgeList[1 + this.frontSide * 4].isChosen || this.bridgeList[2 + this.frontSide * 4].isChosen || this.bridgeList[3 + this.frontSide * 4].isChosen) {
                    p.prior.filter = 1;
                    p.prior.tech = transmit(this.frontSide, "tech");
                    p.prior.pos = transmit(this.frontSide, "pos");
                    p.prior.ballpos = transmit(this.frontSide, "pla");
                }
            }
        }
        let strmsg = JSON.stringify(msg);
        if (strmsg === this.lastMsg) {
            console.timeEnd("Timer");
        } else {
            this.lastMsg = strmsg;
            console.timeEnd("Timer");
            setTimeout(() => {
                timeline.initial(msg);
            }, 280);
        }

        function transmit(side, attr) {
            let ans = {};
            let group;
            let arr = that.isChoosed[side][attr];

            switch (arr.length) {
                case that.plaNum[1]:
                    group = that.plaGroup;
                    break;
                case that.posNum[1]:
                    group = that.posGroup;
                    break;
                case that.techNum[1]:
                    group = that.techGroup;
                    break;
            }
            for (let i of group)
                for (let j of i.List)
                    if (arr[j.branchID] === 1) {
                        ans[j.dataID.toString()] = 1;
                    }

            let flag;
            switch (attr) {
                case "pla":
                    flag = that.bridgeList[1 + side * 4].isChosen;
                    break;
                case "pos":
                    flag = that.bridgeList[3 + side * 4].isChosen;
                    break;
                case "tech":
                    flag = that.bridgeList[2 + side * 4].isChosen;
                    break;
            }
            if (flag) return ans;

            ans["-1"] = 1;
            return ans;
        }
    }

    draw() {
        this.drawBackground();
        this.drawBridge0();// for p1 pla |
        this.drawBridge1();// for p1 pla -
        this.drawBridge2();// for p1 tech
        this.drawBridge3();// for p1 pos
        this.drawBridge4();// for p2 pla |
        this.drawBridge5();// for p2 pla -
        this.drawBridge6();// for p2 tech
        this.drawBridge7();// for p2 pos
        this.drawBridge8();// for p1
        this.drawBridge9();// for p2

        this.drawMatrix0();// for p1&p2
        this.drawMatrix1();// for p1 pos&tech
        this.drawMatrix2();// for p1 tech&pla
        this.drawMatrix3();// for p1 pos&pla
        this.drawMatrix4();// for p2 pos&tech
        this.drawMatrix5();// for p2 tech&pla
        this.drawMatrix6();// for p2 pos&pla

        this.drawPlayer1();// for p1
        this.drawPlayer2();// for p2

        this.drawOrder();
        this.drawSwitch();
        this.drawLock();

        this.drawHint();
    }

    drawBackground() {
        let width = this.plaLength;
        let size = width / Math.sqrt(2);
        let center = this.leftPadding +
            this.posLength +
            this.bridgeLength +
            width * this.playerSize +
            this.playerSpace / 2 +
            size;
        let cp = [this.width - 1, 0];
        size = center + size - cp[0];
        this.bg = this.svg.append("g")
            .attr("transform", `translate(${cp[0]},${cp[1]})`);
        this.bg.append("path")
            .attr("d", () => {
                return `M0 ${-size - this.bgWidth}
                L${this.width * 9 / 22} ${-size - this.bgWidth}
                L${this.width * 9 / 22} ${size + this.bgWidth - this.width * 9 / 22 - this.bgRadius}
                Q${this.width * 9 / 22} ${size + this.bgWidth - this.width * 9 / 22}
                ${this.width * 9 / 22 - this.bgRadius / Math.sqrt(2)} ${size + this.bgWidth - this.width * 9 / 22 + this.bgRadius / Math.sqrt(2)}
                L0 ${size + this.bgWidth}`
            })
            .style("stroke-width", "0")
            .style("fill", "rgb(255,255,255)");
        this.bg.append("path")
            .style("stroke-width", 4)
            .style("stroke", "rgb(90,102,123)")
            .attr("d", `M${-this.width+this.orderBtnParams.pos+this.orderBtnParams.width/2} 0L${-this.width+this.lockBtnParams.pos+this.lockBtnParams.width/2} 0`);
    }

    drawMatrix0() {
        this.matrixList[0] = new mainMatrices_Matrix({
            "cx": this.leftPadding +
            this.posLength +
            this.bridgeLength +
            this.plaLength * this.playerSize +
            this.playerSpace / 2,
            "cy": 0,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "xDir": 1,
            "yDir": 1,
            "rotate": -45,
            "rootDom": this.svg,
            "xGroup": this.plaGroup,
            "yGroup": this.plaGroup,
            "father": this,
            "player": 0,
            "data": 0
        });
    }

    drawMatrix1() {
        this.matrixList[1] = new mainMatrices_Matrix({
            "cx": this.leftPadding + this.posLength,
            "cy": -this.playerSpace / 2 - this.plaLength - this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "xDir": -1,
            "yDir": -1,
            "rotate": 0,
            "rootDom": this.svg,
            "xGroup": this.posGroup,
            "yGroup": this.techGroup,
            "father": this,
            "player": 1,
            "data": 1
        });
    }

    drawMatrix2() {
        this.matrixList[2] = new mainMatrices_Matrix({
            "cx": this.leftPadding + this.posLength + this.bridgeLength,
            "cy": -this.playerSpace / 2 - this.plaLength - this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "xDir": 1,
            "yDir": -1,
            "rotate": 0,
            "rootDom": this.svg,
            "xGroup": this.plaGroup,
            "yGroup": this.techGroup,
            "father": this,
            "player": 1,
            "data": 2
        });
    }

    drawMatrix3() {
        this.matrixList[3] = new mainMatrices_Matrix({
            "cx": this.leftPadding + this.posLength,
            "cy": -this.playerSpace / 2 - this.plaLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "xDir": -1,
            "yDir": 1,
            "rotate": 0,
            "rootDom": this.svg,
            "xGroup": this.posGroup,
            "yGroup": this.plaGroup,
            "father": this,
            "player": 1,
            "data": 3
        });
    }

    drawMatrix4() {
        this.matrixList[4] = new mainMatrices_Matrix({
            "cx": this.leftPadding + this.posLength,
            "cy": this.playerSpace / 2 + this.plaLength + this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "xDir": -1,
            "yDir": 1,
            "rotate": 0,
            "rootDom": this.svg,
            "xGroup": this.posGroup,
            "yGroup": this.techGroup,
            "father": this,
            "player": 2,
            "data": 4
        });
    }

    drawMatrix5() {
        this.matrixList[5] = new mainMatrices_Matrix({
            "cx": this.leftPadding + this.posLength + this.bridgeLength,
            "cy": this.playerSpace / 2 + this.plaLength + this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "xDir": 1,
            "yDir": 1,
            "rotate": 0,
            "rootDom": this.svg,
            "xGroup": this.plaGroup,
            "yGroup": this.techGroup,
            "father": this,
            "player": 2,
            "data": 5
        });
    }

    drawMatrix6() {
        this.matrixList[6] = new mainMatrices_Matrix({
            "cx": this.leftPadding + this.posLength,
            "cy": this.playerSpace / 2 + this.plaLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "xDir": -1,
            "yDir": -1,
            "rotate": 0,
            "rootDom": this.svg,
            "xGroup": this.posGroup,
            "yGroup": this.plaGroup,
            "father": this,
            "player": 2,
            "data": 6
        });
    }

    drawBridge0() {
        this.bridgeList[0] = new mainMatrices_Bridge({
            "cx": this.leftPadding + this.posLength + this.bridgeLength,
            "cy": -this.playerSpace / 2 - this.plaLength - this.bridgeLength,
            "bridgeLength": this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "tagSize": this.tagSize,
            "xDir": 1,
            "yDir": -1,
            "rotate": 90,
            "rootDom": this.svg,
            "group": this.plaGroup,
            "tagNum": 1,
            "father": this,
            "player": 1
        });
    }

    drawBridge1() {
        this.bridgeList[1] = new mainMatrices_Bridge({
            "cx": this.leftPadding + this.posLength,
            "cy": -this.playerSpace / 2 - this.plaLength,
            "bridgeLength": this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "tagSize": this.tagSize,
            "xDir": 1,
            "yDir": 1,
            "rotate": 0,
            "rootDom": this.svg,
            "group": this.plaGroup,
            "tagNum": 1,
            "father": this,
            "player": 1
        });
    }

    drawBridge2() {
        this.bridgeList[2] = new mainMatrices_Bridge({
            "cx": this.leftPadding + this.posLength,
            "cy": -this.playerSpace / 2 - this.plaLength - this.bridgeLength,
            "bridgeLength": this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "tagSize": this.tagSize,
            "xDir": 1,
            "yDir": -1,
            "rotate": 0,
            "rootDom": this.svg,
            "group": this.techGroup,
            "tagNum": 2,
            "father": this,
            "player": 1
        });
    }

    drawBridge3() {
        this.bridgeList[3] = new mainMatrices_Bridge({
            "cx": this.leftPadding + this.posLength,
            "cy": -this.playerSpace / 2 - this.plaLength,
            "bridgeLength": this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "tagSize": this.tagSize,
            "xDir": -1,
            "yDir": 1,
            "rotate": 90,
            "rootDom": this.svg,
            "group": this.posGroup,
            "tagNum": 2,
            "father": this,
            "player": 1
        });
    }

    drawBridge4() {
        this.bridgeList[4] = new mainMatrices_Bridge({
            "cx": this.leftPadding + this.posLength + this.bridgeLength,
            "cy": this.playerSpace / 2 + this.plaLength + this.bridgeLength,
            "bridgeLength": this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "tagSize": this.tagSize,
            "xDir": -1,
            "yDir": -1,
            "rotate": 90,
            "rootDom": this.svg,
            "group": this.plaGroup,
            "tagNum": 1,
            "father": this,
            "player": 2
        });
    }

    drawBridge5() {
        this.bridgeList[5] = new mainMatrices_Bridge({
            "cx": this.leftPadding + this.posLength,
            "cy": this.playerSpace / 2 + this.plaLength,
            "bridgeLength": this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "tagSize": this.tagSize,
            "xDir": 1,
            "yDir": -1,
            "rotate": 0,
            "rootDom": this.svg,
            "group": this.plaGroup,
            "tagNum": 1,
            "father": this,
            "player": 2
        });
    }

    drawBridge6() {
        this.bridgeList[6] = new mainMatrices_Bridge({
            "cx": this.leftPadding + this.posLength,
            "cy": this.playerSpace / 2 + this.plaLength + this.bridgeLength,
            "bridgeLength": this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "tagSize": this.tagSize,
            "xDir": 1,
            "yDir": 1,
            "rotate": 0,
            "rootDom": this.svg,
            "group": this.techGroup,
            "tagNum": 2,
            "father": this,
            "player": 2
        });
    }

    drawBridge7() {
        this.bridgeList[7] = new mainMatrices_Bridge({
            "cx": this.leftPadding + this.posLength,
            "cy": this.playerSpace / 2 + this.plaLength,
            "bridgeLength": this.bridgeLength,
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "tagSize": this.tagSize,
            "xDir": -1,
            "yDir": -1,
            "rotate": -90,
            "rootDom": this.svg,
            "group": this.posGroup,
            "tagNum": 2,
            "father": this,
            "player": 2
        });
    }

    drawBridge8() {
        this.bridgeList[8] = new mainMatrices_Bridge({
            "cx": this.leftPadding + this.posLength + this.bridgeLength + this.plaLength * this.playerSize + this.playerSpace / 2,
            "cy": 0,
            "bridgeLength": this.playerSpace / Math.sqrt(2),
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "tagSize": this.tagSize < (this.playerSpace / Math.sqrt(2) - 3 * this.gridSpace - this.gridSize) ?
                this.tagSize :
                (this.playerSpace / Math.sqrt(2) - 3 * this.gridSpace - this.gridSize),
            "xDir": -1,
            "yDir": -1,
            "rotate": 45,
            "rootDom": this.svg,
            "group": this.plaGroup,
            "tagNum": 1,
            "father": this,
            "player": 1
        });
    }

    drawBridge9() {
        this.bridgeList[9] = new mainMatrices_Bridge({
            "cx": this.leftPadding + this.posLength + this.bridgeLength + this.plaLength * this.playerSize + this.playerSpace / 2,
            "cy": 0,
            "bridgeLength": this.playerSpace / Math.sqrt(2),
            "gridSize": this.gridSize,
            "gridSpace": this.gridSpace,
            "tagSize": this.tagSize < (this.playerSpace / Math.sqrt(2) - 3 * this.gridSpace - this.gridSize) ?
                this.tagSize :
                (this.playerSpace / Math.sqrt(2) - 3 * this.gridSpace - this.gridSize),
            "xDir": -1,
            "yDir": 1,
            "rotate": -45,
            "rootDom": this.svg,
            "group": this.plaGroup,
            "tagNum": 1,
            "father": this,
            "player": 2
        });
    }

    drawPlayer1() {// for p1
        let cp = [this.leftPadding + this.posLength + this.bridgeLength, -this.playerSpace / 2 - this.plaLength];
        let width = this.plaLength;
        let height = this.plaLength;
        this.playerList[0] = this.svg.append("g")
            .attr("transform", `translate(${cp[0]},${cp[1]})`)
            .style("cursor", "pointer")
            .on("click", () => {
                this.rechoosePlayer(0)
            });
        this.playerList[0].append("path")
            .attr("class", "player_fg")
            .attr("d", this.getFrame(0))
            .style("stroke-width", "0")
            .style("fill", this.playerColor[0]);
        this.playerList[0].append("path")
            .attr("d", this.getFrame(5))
            .style("stroke-width", "0")
            .style("fill", "rgb(255, 255, 255)");
        this.playerList[0].append("path")
            .attr("class", "player_fg")
            .attr("d", this.getFrame(10))
            .style("stroke-width", "0")
            .style("fill", this.playerColor[0]);
        this.playerList[0].append("text")
            .attr("x", width * this.playerSize * 1.35)
            .attr("y", height * this.playerSize * 1.35)
            .attr("class", "player_font")
            .style("font-size", height / 2)
            .text("P1");
    }

    drawPlayer2() {// for p2
        let cp = [this.leftPadding + this.posLength + this.bridgeLength, this.playerSpace / 2 + this.plaLength];
        let width = this.plaLength;
        let height = this.plaLength;
        this.playerList[1] = this.svg.append("g")
            .attr("transform", `translate(${cp[0]},${cp[1]}) scale(1, -1)`)
            .style("cursor", "pointer")
            .on("click", () => {
                this.rechoosePlayer(1)
            });
        this.playerList[1].append("path")
            .attr("class", "player_fg")
            .attr("d", this.getFrame(0))
            .style("stroke-width", "0")
            .style("fill", this.playerColor[1]);
        this.playerList[1].append("path")
            .attr("d", this.getFrame(5))
            .style("stroke-width", "0")
            .style("fill", "rgb(255, 255, 255)");
        this.playerList[1].append("path")
            .attr("class", "player_fg")
            .attr("d", this.getFrame(10))
            .style("stroke-width", "0")
            .style("fill", this.playerColor[1]);
        this.playerList[1].append("text")
            .attr("transform", "scale(1, -1)")
            .attr("x", width * this.playerSize * 1.35)
            .attr("y", -height * this.playerSize * (1.35 - 0.35))
            .attr("class", "player_font")
            .style("font-size", height / 2)
            .text("P2");
    }

    getFrame(bj) {
        let width = this.plaLength;
        let height = this.plaLength;
        return `M${bj} ${bj}
                L${bj} ${height - bj}
                L${width * this.playerSize - bj * Math.tan(22.5)} ${height - bj}
                L${width - bj} ${height * this.playerSize - bj * Math.tan(22.5)}
                L${width - bj} ${bj}
                Z`;
    }

    drawOrder() {
        this.orderButton = this.svg.append("g")
            .attr("class", "matrix_btn")
            .attr("transform", `translate(${this.orderBtnParams.pos + this.orderBtnParams.width / 2},0)`)
            .on("click", () => {
                this.changeOrder()
            });

        let l = -this.orderBtnParams.width / 2,
            r = this.orderBtnParams.width / 2,
            u = -this.orderBtnParams.height / 2,
            d = this.orderBtnParams.height / 2,
            a = this.orderBtnParams.rad,
            w = this.orderBtnParams.width,
            h = this.orderBtnParams.height,
            wscale = 0.4, hscale = 1;
        let button0 = this.orderButton.append("g")
            .attr("transform", "scale(1,1)")
            .attr("class", "dechosen");
        let button1 = this.orderButton.append("g")
            .attr("transform", "scale(-1,-1)")
            .attr("class", "chosen");

        addArrow(button0);
        addArrow(button1);

        function addArrow(rootG) {
            rootG.append("path")
                .attr("class", "btn_bg")
                .attr("d", `M0 ${u}
                            L${r-a} ${u}
                            Q${r} ${u}
                             ${r} ${u+a}
                            L${r} ${d-a}
                            Q${r} ${d}
                             ${r-a} ${d}
                            L0 ${d}
                            Z`);
            rootG.append("path")
                .attr("class", "btn_fg")
                .attr("transform", `translate(${r * 0.5},0)`)
                .attr("d", `M0 ${u * 0.7 * hscale}
                            L${l * 0.6 * wscale} 0
                            L${l * 0.35 * wscale} 0
                            L${l * 0.35 * wscale} ${d * 0.7 * hscale}
                            L${r * 0.35 * wscale} ${d * 0.7 * hscale}
                            L${r * 0.35 * wscale} 0
                            L${r * 0.6 * wscale} 0
                            Z`);
        }
    }

    drawSwitch() {
        this.switchButton = this.svg.append("g")
            .attr("class", "matrix_btn")
            .attr("transform", `translate(${this.switchBtnParams.pos + this.switchBtnParams.width / 2},0)`)
            .on("click", () => {
                let temp = this.switchButton.select(".chosen");
                this.switchButton.select(".dechosen").attr("class", "chosen");
                temp.attr("class", "dechosen");

                this.switchMode();
                this.switchButton.select(".compass_arrow")
                    .transition().duration(300)
                    .attr("transform", `rotate(${this.codingMode===1?45:-45})`);
            });

        let l = -this.switchBtnParams.width / 2,
            r = this.switchBtnParams.width / 2,
            u = -this.switchBtnParams.height / 2,
            d = this.switchBtnParams.height / 2,
            a = this.switchBtnParams.rad;

        let tag0 = this.switchButton.append("g")
            .attr("class", "chosen");
        let tag1 = this.switchButton.append("g")
            .attr("class", "dechosen");
        addTag(tag0, "scoring rate", -1);
        addTag(tag1, "varying rate", 1);

        let compass = this.switchButton.append("g")
            .attr("transform", `translate(${l+d},0)`);
        compass.append("circle")
            .style("fill", "rgb(255,255,255)")
            .attr("r", d);
        let innerR = d*2/3, outerR = d-1, subdividing = 50;
        for(let i = 0; i < subdividing; i++) {
            let x0 = innerR*Math.sin(i/subdividing*2*Math.PI), y0 = -innerR*Math.cos(i/subdividing*2*Math.PI),
                x1 = outerR*Math.sin(i/subdividing*2*Math.PI), y1 = -outerR*Math.cos(i/subdividing*2*Math.PI),
                x2 = outerR*Math.sin((i+1)/subdividing*2*Math.PI), y2 = -outerR*Math.cos((i+1)/subdividing*2*Math.PI),
                x3 = innerR*Math.sin((i+1)/subdividing*2*Math.PI), y3 = -innerR*Math.cos((i+1)/subdividing*2*Math.PI),
                color = 200 - i*200.0/subdividing;
            compass.append("path")
                .attr("d", `M${x0} ${y0}L${x1} ${y1}L${x2} ${y2}L${x3} ${y3}Z`)
                .style("fill", `rgb(${color},${color},${color})`);
        }
        compass.append("circle")
            .style("fill", "rgb(200,200,200)")
            .attr("r", d/3);
        compass.append("path")
            .attr("class", "compass_arrow")
            .attr("transform", `rotate(-45)`)
            .style("fill", "rgb(90,102,123)")
            .attr("d", `M${d*2/3} 0L${d/3} ${-d/3/Math.sqrt(3)}L${d/3} ${d/3/Math.sqrt(3)}Z`);

        function addTag(rootG, text, direct) {
            rootG.append("path")
                .attr("class", "btn_bg")
                .attr("transform", `scale(1,${direct})`)
                .attr("d", `M${l+d} 0L${l+d} ${d-a}Q${l+d} ${d} ${l+d+a} ${d}L${r-a} ${d}Q${r} ${d} ${r} ${d-a}L${r} 0Z`);
            rootG.append("text")
                .attr("class", "btn_fg")
                .attr("x", r-2).attr("y", d/2*direct)
                .style("font-size", d/2)
                .style("text-anchor", "end")
                .style("dominant-baseline", "middle")
                .text(text);
        }
    }

    drawLock() {
        this.lockButton = this.svg.append("g")
            .attr("class", "matrix_btn")
            .attr("isOn", 1)
            .attr("transform", `translate(${this.lockBtnParams.pos + this.lockBtnParams.width / 2},0)`);

        let l = -this.lockBtnParams.width / 2,
            r = this.lockBtnParams.width / 2,
            u = -this.lockBtnParams.height / 2,
            d = this.lockBtnParams.height / 2,
            a = this.lockBtnParams.rad;
        let bg = this.lockButton.append("g").attr("class", "chosen");
        bg.append("path")
            .attr("class", "btn_bg")
            .attr("d", getRect(l, r, u, d, a));
        bg.append("text")
            .attr("class", "player_font")
            .attr("x", l/2).attr("y", 0)
            .attr("font-size", d)
            .text("on");
        bg.append("text")
            .attr("class", "player_font")
            .attr("x", r/2).attr("y", 0)
            .attr("font-size", d)
            .text("off");
        let btn = this.lockButton.append("g").attr("class", "dechosen");
        btn.append("circle")
            .attr("class", "btn_fg")
            .attr("cx", r/2).attr("cy", 0)
            .attr("r", d*1.5);
        this.lockButton.on("click", () => {
            this.lockButton.attr("isOn", 1-this.lockButton.attr("isOn"));
            let temp = btn.select("circle");
            temp.transition().duration(50).attr("cx", -temp.attr("cx"));
            this.lockSide()
        });

        function getRect(l, r, u, d, a) {
            return `M${l} ${u + a}
            Q${l} ${u} ${l + a} ${u} L${r - a} ${u}
            Q${r} ${u} ${r} ${u + a} L${r} ${d - a}
            Q${r} ${d} ${r - a} ${d} L${l + a} ${d}
            Q${l} ${d} ${l} ${d - a} Z`;
        }
    }

    drawHint() {
        this.hintGroup = new Array(2);
        this.hintTxt = new Array(2);
        this.hintTotal = new Array(2);
        this.hintScore = new Array(2);
        this.hintChange = new Array(2);
        for (let i = 0; i < 2; i++) {
            this.hintGroup[i] = this.svg.append("g")
                .attr("transform", `translate(0,0) scale(-1,1)`);
            this.hintGroup[i].append("path")
                .attr("class", "hint_bg")
                .attr("transform", "rotate(0)")
                .attr("d", `M${this.hintCursorDis} 0
                        L${this.hintCursorDis + this.hintCursorSize * Math.sqrt(3) / 2} ${this.hintCursorSize / 2}
                        L${this.hintCursorDis + this.hintCursorSize * Math.sqrt(3) / 2} ${-this.hintCursorSize / 2}
                        Z`);
            this.hintTxt[i] = this.hintGroup[i].append("g")
                .attr("transform", `translate(${this.hintCursorDis + this.hintCursorSize * Math.sqrt(3) / 2 + this.hintSize / 2},0) scale(-1,1)`);
            this.hintTxt[i].append("rect")
                .attr("class", "hint_bg")
                .attr("x", -this.hintSize / 2).attr("y", -this.hintSize / 2)
                .attr("width", this.hintSize).attr("height", this.hintSize)
                .attr("rx", this.hintSize / 10).attr("ry", this.hintSize / 10);
            this.hintTxt[i].append("text")
                .attr("class", "hint_text")
                .attr("transform", `translate(${-this.hintSize / 6},${-this.hintSize / 4})`)
                .style("font-size", this.hintFont)
                .text("Total");
            this.hintTxt[i].append("text")
                .attr("class", "hint_text")
                .attr("transform", `translate(${-this.hintSize / 6},0)`)
                .style("font-size", this.hintFont)
                .text("Score");
            this.hintTxt[i].append("text")
                .attr("class", "hint_text")
                .attr("transform", `translate(${-this.hintSize / 6},${this.hintSize / 4})`)
                .style("font-size", this.hintFont)
                .text("Change");
            this.hintTxt[i].append("text")
                .attr("class", "hint_text")
                .attr("transform", `translate(${this.hintSize / 6},${-this.hintSize / 4})`)
                .style("font-size", this.hintFont)
                .text(":");
            this.hintTxt[i].append("text")
                .attr("class", "hint_text")
                .attr("transform", `translate(${this.hintSize / 6},0)`)
                .style("font-size", this.hintFont)
                .text(":");
            this.hintTxt[i].append("text")
                .attr("class", "hint_text")
                .attr("transform", `translate(${this.hintSize / 6},${this.hintSize / 4})`)
                .style("font-size", this.hintFont)
                .text(":");
            this.hintTotal[i] = this.hintTxt[i].append("text")
                .attr("class", "hint_text")
                .attr("transform", `translate(${this.hintSize / 3},${-this.hintSize / 4})`)
                .style("font-size", this.hintFont)
                .text("0");
            this.hintScore[i] = this.hintTxt[i].append("text")
                .attr("class", "hint_text")
                .attr("transform", `translate(${this.hintSize / 3},0)`)
                .style("font-size", this.hintFont)
                .text("0");
            this.hintChange[i] = this.hintTxt[i].append("text")
                .attr("class", "hint_text")
                .attr("transform", `translate(${this.hintSize / 3},${this.hintSize / 4})`)
                .style("font-size", this.hintFont)
                .text("0");
        }
    }

    refreshHint(params) {
        let matrixID = params.matrixID,
            kx = params.x,
            ky = params.y;

        let mList;
        if (this.matrixList[0].isLocked) mList = [(matrixID - 1) % 3 + 1, (matrixID - 1) % 3 + 4];
        else mList = [matrixID];

        for (let i = 0; i < mList.length; i++) {
            let matrix = this.matrixList[mList[i]];
            let box = matrix.gridList[kx][ky]._groups[0][0].getBoundingClientRect();
            let data = matrix.XisMerged[kx] === 1 ?
                (matrix.YisMerged[ky] === 1 ? (matrix.mergeData.all) : (matrix.mergeData.y[ky])) :
                (matrix.YisMerged[ky] === 1 ? (matrix.mergeData.x[kx]) : (matrix.data[kx][ky]));

            let x = box.left + box.width / 2, y = box.top + box.height / 2;
            let translate = 0;
            let dir;

            if (y - this.hintSize / 2 < 0) translate = this.hintSize / 2 - y;
            if (y + this.hintSize / 2 > this.height) translate = this.height - y - this.hintSize / 2;
            switch (matrixID) {
                case 0:
                case 2:
                case 5:
                    dir = -1;
                    break;
                case 1:
                case 3:
                case 4:
                case 6:
                    dir = 1;
                    break;
            }

            this.hintGroup[i].attr("transform", `translate(${x},${y - this.height / 2}) scale(${dir},1)`);
            this.hintTxt[i].attr("transform", `translate(${this.hintCursorDis + this.hintCursorSize * Math.sqrt(3) / 2 + this.hintSize / 2},${translate}) scale(${dir},1)`);
            this.hintTotal[i].text(data.count);
            this.hintScore[i].text(data.win);
            this.hintChange[i].text(data.change);
        }
    }

    removeHint() {
        for (let i = 0; i < 2; i++) this.hintGroup[i].attr("transform", `translate(0,0) scale(-1,1)`);
    }

    hoverAttr(params) {
        switch (params.Player) {
            case 0:
                let id0 = params.List[0],
                    id1 = params.List[1];
                this.matrixList[0].hoverX(id0);
                this.matrixList[0].hoverY(id1);
                this.matrixList[2].hoverX(id0);
                this.matrixList[3].hoverY(id0);
                this.matrixList[5].hoverX(id1);
                this.matrixList[6].hoverY(id1);
                this.bridgeList[0].hover(id0);
                this.bridgeList[1].hover(id0);
                this.bridgeList[8].hover(id0);
                this.bridgeList[4].hover(id1);
                this.bridgeList[5].hover(id1);
                this.bridgeList[9].hover(id1);
                break;
            case 1:
                for (let j = 0; j < 2; j++)
                    if (j === 0 || (j === 1 && this.matrixList[0].isLocked)) {
                        for (let i = 0; i < params.List.length; i++) {
                            let id = params.List[i];
                            if (id <= 12) {
                                this.matrixList[0].hoverX(id);
                                this.matrixList[2 + j * 3].hoverX(id);
                                this.matrixList[3 + j * 3].hoverY(id);
                                this.bridgeList[j * 4].hover(id);
                                this.bridgeList[1 + j * 4].hover(id);
                                this.bridgeList[8 + j].hover(id);
                            } else if (id <= 21) {
                                this.matrixList[1 + j * 3].hoverX(id);
                                this.matrixList[3 + j * 3].hoverX(id);
                                this.bridgeList[3 + j * 4].hover(id);
                            } else {
                                this.matrixList[1 + j * 3].hoverY(id);
                                this.matrixList[2 + j * 3].hoverY(id);
                                this.bridgeList[2 + j * 4].hover(id);
                            }
                        }
                    }
                break;
            case 2:
                for (let j = 0; j < 2; j++)
                    if (j === 0 || (j === 1 && this.matrixList[0].isLocked)) {
                        for (let i = 0; i < params.List.length; i++) {
                            let id = params.List[i];
                            if (id <= 12) {
                                this.matrixList[0].hoverY(id);
                                this.matrixList[5 - j * 3].hoverX(id);
                                this.matrixList[6 - j * 3].hoverY(id);
                                this.bridgeList[4 - j * 4].hover(id);
                                this.bridgeList[5 - j * 4].hover(id);
                                this.bridgeList[9 - j].hover(id);
                            } else if (id <= 21) {
                                this.matrixList[4 - j * 3].hoverX(id);
                                this.matrixList[6 - j * 3].hoverX(id);
                                this.bridgeList[7 - j * 4].hover(id);
                            } else {
                                this.matrixList[4 - j * 3].hoverY(id);
                                this.matrixList[5 - j * 3].hoverY(id);
                                this.bridgeList[6 - j * 4].hover(id);
                            }
                        }
                    }
                break;
            default:
                console.warn(`There is no player ${params.Player}`);
                break;
        }
    }

    deHover() {
        for (let i = 0; i < 7; i++) this.matrixList[i].deHover();
        for (let i = 0; i < 10; i++) this.bridgeList[i].deHover();
    }

    clickAttr(params) {
        console.log("clickAttr:");
        console.time('Timer');
        switch (params.Player) {
            case 0:
                let id0 = params.List[0],
                    id1 = params.List[1];
                this.matrixList[0].clickX(id0);
                this.matrixList[0].clickY(id1);
                this.matrixList[2].clickX(id0);
                this.matrixList[3].clickY(id0);
                this.matrixList[5].clickX(id1);
                this.matrixList[6].clickY(id1);
                this.bridgeList[0].click(id0);
                this.bridgeList[1].click(id0);
                this.bridgeList[8].click(id0);
                this.bridgeList[4].click(id1);
                this.bridgeList[5].click(id1);
                this.bridgeList[9].click(id1);
                break;
            case 1:
                for (let i = 0; i < params.List.length; i++) {
                    let id = params.List[i];
                    if (id <= 12) {
                        this.matrixList[0].clickX(id);
                        this.matrixList[2].clickX(id);
                        this.matrixList[3].clickY(id);
                        this.bridgeList[0].click(id);
                        this.bridgeList[1].click(id);
                        this.bridgeList[8].click(id);
                    } else if (id <= 21) {
                        this.matrixList[1].clickX(id);
                        this.matrixList[3].clickX(id);
                        this.bridgeList[3].click(id);
                    } else {
                        this.matrixList[1].clickY(id);
                        this.matrixList[2].clickY(id);
                        this.bridgeList[2].click(id);
                    }
                }
                break;
            case 2:
                for (let i = 0; i < params.List.length; i++) {
                    let id = params.List[i];
                    if (id <= 12) {
                        this.matrixList[0].clickY(id);
                        this.matrixList[5].clickX(id);
                        this.matrixList[6].clickY(id);
                        this.bridgeList[4].click(id);
                        this.bridgeList[5].click(id);
                        this.bridgeList[9].click(id);
                    } else if (id <= 21) {
                        this.matrixList[4].clickX(id);
                        this.matrixList[6].clickX(id);
                        this.bridgeList[7].click(id);
                    } else {
                        this.matrixList[4].clickY(id);
                        this.matrixList[5].clickY(id);
                        this.bridgeList[6].click(id);
                    }
                }
                break;
            default:
                console.warn(`There is no player ${params.Player}`);
                break;
        }
        this.refreshData();
    }

    deChoose() {
        for (let i = 0; i < 7; i++) this.matrixList[i].deClick();
        for (let i = 0; i < 10; i++) this.bridgeList[i].deClick();
        this.refreshData();
    }

    dblClickAttr(params) {
        console.log("dblclickAttr:");
        console.time('Timer');
        switch (params.Player) {
            case 0:
                let id0 = params.List[0],
                    id1 = params.List[1];
                this.matrixList[0].dblClickX(id0);
                this.matrixList[0].dblClickY(id1);
                this.matrixList[2].dblClickX(id0);
                this.matrixList[3].dblClickY(id0);
                this.matrixList[5].dblClickX(id1);
                this.matrixList[6].dblClickY(id1);
                this.bridgeList[0].dblClick(id0);
                this.bridgeList[1].dblClick(id0);
                this.bridgeList[8].dblClick(id0);
                this.bridgeList[4].dblClick(id1);
                this.bridgeList[5].dblClick(id1);
                this.bridgeList[9].dblClick(id1);
                break;
            case 1:
                for (let i = 0; i < params.List.length; i++) {
                    let id = params.List[i];
                    if (id <= 12) {
                        this.matrixList[0].dblClickX(id);
                        this.matrixList[2].dblClickX(id);
                        this.matrixList[3].dblClickY(id);
                        this.bridgeList[0].dblClick(id);
                        this.bridgeList[1].dblClick(id);
                        this.bridgeList[8].dblClick(id);
                    } else if (id <= 21) {
                        this.matrixList[1].dblClickX(id);
                        this.matrixList[3].dblClickX(id);
                        this.bridgeList[3].dblClick(id);
                    } else {
                        this.matrixList[1].dblClickY(id);
                        this.matrixList[2].dblClickY(id);
                        this.bridgeList[2].dblClick(id);
                    }
                }
                break;
            case 2:
                for (let i = 0; i < params.List.length; i++) {
                    let id = params.List[i];
                    if (id <= 12) {
                        this.matrixList[0].dblClickY(id);
                        this.matrixList[5].dblClickX(id);
                        this.matrixList[6].dblClickY(id);
                        this.bridgeList[4].dblClick(id);
                        this.bridgeList[5].dblClick(id);
                        this.bridgeList[9].dblClick(id);
                    } else if (id <= 21) {
                        this.matrixList[4].dblClickX(id);
                        this.matrixList[6].dblClickX(id);
                        this.bridgeList[7].dblClick(id);
                    } else {
                        this.matrixList[4].dblClickY(id);
                        this.matrixList[5].dblClickY(id);
                        this.bridgeList[6].dblClick(id);
                    }
                }
                break;
            default:
                console.warn(`There is no player ${params.Player}`);
                break;
        }
        this.refreshData();
    }

    deMerge() {
        for (let i = 0; i < 7; i++) this.matrixList[i].deDblClick();
        for (let i = 0; i < 10; i++) this.bridgeList[i].deDblClick();
        this.refreshData();
    }

    changeOrder() {
        const temp0 = this.orderButton.select(".chosen"), temp1 = this.orderButton.select(".dechosen");
        if(temp0 !== undefined && temp1 !== undefined) {
            temp0.attr("class", "dechosen");
            temp1.attr("class", "chosen");

            console.log("changeOrder:");
            console.time('Timer');
            this.dataLock = true;
            this.deChoose();
            this.deMerge();
            this.frontSide = 1 - this.frontSide;
            this.dataLock = false;
            this.refreshData();
        }
    }

    switchMode() {
        console.log("switchMode:");
        console.time('Timer');
        this.codingMode = 1 - this.codingMode;

        this.dataLock = false;
        this.refreshData({transfer: false});
    }

    lockSide() {
        console.log("lockSide:");
        console.time('Timer');
        this.dataLock = true;
        this.deChoose();
        this.deMerge();

        this.bridgeList[8].lock();
        this.bridgeList[9].lock();
        this.matrixList[0].lock();
        let opacity = +this.lockButton.attr("isOn");

        this.orderButton.selectAll("g").attr("class", function() {
            const temp = d3.select(this).attr("class");
            if(opacity === 1) return temp.substring(1);
            else return "n" + temp;
        });
        for (let i = 0; i < 2; i++) {
            this.playerList[i].selectAll(".player_fg").transition().duration(300).style("fill", opacity === 1 ? (this.mainPlayer === this.playerID[i] ? this.playerColor[i] : this.playerColor[2]) : this.playerColor[this.playerID[i]]);
        }

        this.dataLock = false;
        this.refreshData();
    }

    rechoosePlayer(side) {
        if (this.matrixList[0].isLocked) return;

        console.log("rechoosePlayer:");
        console.time('Timer');
        this.dataLock = true;
        this.deChoose();
        this.deMerge();

        let player = this.playerID[side];
        if (this.mainPlayer === player) return;
        this.mainPlayer = player;

        this.bridgeList[8].resetLinkClass(`link_p${player + 1} normal`);
        this.bridgeList[9].resetLinkClass(`link_p${player + 1} normal`);

        this.playerList[side].selectAll(".player_fg").transition().duration(300).style("fill", this.playerColor[this.playerID[side]]);
        this.playerList[1 - side].selectAll(".player_fg").transition().duration(300).style("fill", this.playerColor[2]);

        this.dataLock = false;
        this.refreshData();
    }

    getAngleRatio() {
        let width = this.plaLength;
        let size = width / Math.sqrt(2);
        let center = this.leftPadding +
            this.posLength +
            this.bridgeLength +
            width * this.playerSize +
            this.playerSpace / 2 +
            size;
        let cp = [this.width, 0];
        size = center + size - cp[0];
        return (size + this.bgWidth) * 2 / this.height;
    }
}

class mainMatrices_Matrix {
    constructor(params) {
        this.cx = params.cx;
        this.cy = params.cy;
        this.gridSize = params.gridSize;
        this.gridSpace = params.gridSpace;
        this.xDir = params.xDir;
        this.yDir = params.yDir;
        this.rotate = params.rotate;
        this.rootDom = params.rootDom;
        this.xGroup = params.xGroup;
        this.yGroup = params.yGroup;
        this.father = params.father;
        this.player = params.player;
        this.data = params.data;
        this.matrixID = params.data;

        this.xNum = this.xGroup[this.xGroup.length - 1].List[this.xGroup[this.xGroup.length - 1].List.length - 1].branchID;
        this.yNum = this.yGroup[this.yGroup.length - 1].List[this.yGroup[this.yGroup.length - 1].List.length - 1].branchID;
        this.gridList = new Array(this.xNum + 1);
        for (let i = 0; i <= this.xNum; i++) this.gridList[i] = new Array(this.yNum + 1);
        this.father.reconstructData[this.data] = new Array(this.xNum + 1);
        for (let i = 0; i <= this.xNum; i++) {
            this.father.reconstructData[this.data][i] = new Array(this.yNum + 1);
            for (let j = 0; j <= this.yNum; j++)
                this.father.reconstructData[this.data][i][j] = {
                    max: 0,
                    count: 0,
                    win: 0,
                    change: 0
                };
        }
        this.father.mergeData[this.data] = {
            x: new Array(this.xNum + 1),
            y: new Array(this.yNum + 1),
            all: {
                max: 0,
                count: 0,
                win: 0,
                change: 0
            }
        };
        this.mergeData = this.father.mergeData[this.data];
        for (let i = 0; i < this.mergeData.x.length; i++) this.mergeData.x[i] = {
            max: 0,
            count: 0,
            win: 0,
            change: 0
        };
        for (let i = 0; i < this.mergeData.y.length; i++) this.mergeData.y[i] = {
            max: 0,
            count: 0,
            win: 0,
            change: 0
        };
        this.data = this.father.reconstructData[this.data];

        this.isLocked = 0;
        this.XisHovered = new Array(this.xNum + 1);
        this.XisChoosed = new Array(this.xNum + 1);
        this.XisMerged = new Array(this.xNum + 1);
        for (let i = 0; i <= this.xNum; i++) {
            this.XisHovered[i] = 0;
            this.XisChoosed[i] = 1;
            this.XisMerged[i] = 0;
        }
        this.YisHovered = new Array(this.yNum + 1);
        this.YisChoosed = new Array(this.yNum + 1);
        this.YisMerged = new Array(this.yNum + 1);
        for (let i = 0; i <= this.yNum; i++) {
            this.YisHovered[i] = 0;
            this.YisChoosed[i] = 1;
            this.YisMerged[i] = 0;
        }

        this.draw();
    }

    refreshData() {
        if (this.isLocked) return;

        let that = this;
        let bound = this.gridSize * 0.6;
        for (let i = 0; i <= this.xNum; i++)
            for (let j = 0; j <= this.yNum; j++) {
                let showData = this.data[i][j];
                if (this.XisMerged[i] === 1) showData = this.mergeData.y[j];
                if (this.YisMerged[j] === 1) showData = this.mergeData.x[i];
                if (this.XisMerged[i] === 1 && this.YisMerged[j] === 1) showData = this.mergeData.all;
                // rect
                let size = this.XisChoosed[i] === 1 && this.YisChoosed[j] === 1 ? getSize(showData) : this.gridSize - 1;
                this.gridList[i][j].select("rect")
                    .transition().duration(300)
                    .attr("x", -size / 2).attr("y", -size / 2)
                    .attr("width", size).attr("height", size);

                // circle
                let r = getRadius(showData);
                let color = getColor(showData);
                this.gridList[i][j].select("circle")
                    .transition().duration(300)
                    .attr("r", r)
                    .attr("fill", color);
            }

        function getSize(data) {
            return that.gridSize - 1;
            // if (data.count === 0) return that.gridSize - 1;
            // return that.gridSize - 1 - data.change / data.count * (that.gridSize - 1 - bound);
        }

        function getRadius(data) {
            if (data.max === 0 || data.count === 0) return 0;
            let scale = d3.scaleThreshold().domain([0, 0.2, 0.4, 0.6, 0.8]).range([0, 0.4, 0.6, 0.75, 0.9, 1]);
            return bound / 2 * scale(data.count / data.max);//+bound/4;
        }

        function getColor(data) {
            let grey;
            if (data.count === 0) grey = 200;
            else {
                switch (that.father.codingMode) {
                    case 0: grey = parseInt(200 - 200 * data.win / data.count); break;
                    case 1: grey = parseInt(200 - 200 * data.change / data.count); break;
                }
            }
            return `rgb(${grey},${grey},${grey})`;
        }
    }

    lock() {
        this.isLocked = 1 - this.isLocked;
        for (let i = 0; i <= this.xNum; i++)
            for (let j = 0; j <= this.yNum; j++) {
                this.gridList[i][j].transition().duration(300).attr("opacity", 1 - this.isLocked);
            }
    }

    hoverX(did) {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.xNum; i++)
            if (this.XisChoosed[i] === 0) return;
        let bid = this.getXBidByDid(did);
        let tmp;

        for (let i = 0; i < bid.length; i++) {
            for (let j = 0; j <= this.yNum; j++) {
                tmp = this.gridList[bid[i]][j].select("path").attr("class");
                this.gridList[bid[i]][j].select("path").attr("class", tmp.replace(/normal/, "hover"));

                tmp = this.gridList[bid[i]][j].select("rect").attr("class");
                this.gridList[bid[i]][j].select("rect").attr("class", tmp.replace(/normal/, "hover"));
            }
            this.XisHovered[bid[i]] = 1;
        }
    }

    hoverY(did) {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.yNum; i++)
            if (this.YisChoosed[i] === 0) return;
        let bid = this.getYBidByDid(did);
        let tmp;

        for (let i = 0; i < bid.length; i++) {
            for (let j = 0; j <= this.xNum; j++) {
                tmp = this.gridList[j][bid[i]].select("path").attr("class");
                this.gridList[j][bid[i]].select("path").attr("class", tmp.replace(/normal/, "hover"));

                tmp = this.gridList[j][bid[i]].select("rect").attr("class");
                this.gridList[j][bid[i]].select("rect").attr("class", tmp.replace(/normal/, "hover"));
            }
            this.YisHovered[bid[i]] = 1;
        }
    }

    deHover() {
        if (this.isLocked === 1) return;

        this.deHoverX();
        this.deHoverY();
    }

    deHoverX() {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.xNum; i++)
            if (this.XisHovered[i] === 1) {
                let tmp;
                for (let j = 0; j <= this.yNum; j++) {
                    tmp = this.gridList[i][j].select("path").attr("class");
                    this.gridList[i][j].select("path").attr("class", tmp.replace(/hover/, "normal"));

                    tmp = this.gridList[i][j].select("rect").attr("class");
                    this.gridList[i][j].select("rect").attr("class", tmp.replace(/hover/, "normal"));
                }
                this.XisHovered[i] = 0;
            }
    }

    deHoverY() {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.yNum; i++)
            if (this.YisHovered[i] === 1) {
                let tmp;
                for (let j = 0; j <= this.xNum; j++) {
                    tmp = this.gridList[j][i].select("path").attr("class");
                    this.gridList[j][i].select("path").attr("class", tmp.replace(/hover/, "normal"));

                    tmp = this.gridList[j][i].select("rect").attr("class");
                    this.gridList[j][i].select("rect").attr("class", tmp.replace(/hover/, "normal"));
                }
                this.YisHovered[i] = 0;
            }
    }

    deClick() {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.xNum; i++) this.XisChoosed[i] = 1;
        for (let i = 0; i <= this.yNum; i++) this.YisChoosed[i] = 1;
        this.clickAft();
    }

    clickX(did) {
        if (this.isLocked === 1) return;

        let bid = this.getXBidByDid(did);
        let i;

        for (i = 0; i < bid.length; i++) this.XisChoosed[bid[i]]--;
        for (i = 0; i <= this.xNum; i++)
            if (this.XisChoosed[i] !== 0) break;
        if (i > this.xNum)
            for (i = 0; i <= this.xNum; i++) this.XisChoosed[i] = 1;
        else {
            for (i = 0; i <= this.xNum; i++) this.XisChoosed[i] = 0;
            for (i = 0; i < bid.length; i++) this.XisChoosed[bid[i]] = 1;
        }
        this.deHoverX();
        this.clickAft();
    }

    deClickX() {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.xNum; i++) this.XisChoosed[i] = 1;
        this.clickAft();
    }

    clickY(did) {
        if (this.isLocked === 1) return;

        let bid = this.getYBidByDid(did);
        let i;

        for (i = 0; i < bid.length; i++) this.YisChoosed[bid[i]]--;
        for (i = 0; i <= this.yNum; i++)
            if (this.YisChoosed[i] !== 0) break;
        if (i > this.yNum)
            for (i = 0; i <= this.yNum; i++) this.YisChoosed[i] = 1;
        else {
            for (i = 0; i <= this.yNum; i++) this.YisChoosed[i] = 0;
            for (i = 0; i < bid.length; i++) this.YisChoosed[bid[i]] = 1;
        }

        this.deHoverY();
        this.clickAft();
    }

    deClickY() {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.yNum; i++) this.YisChoosed[i] = 1;
        this.clickAft();
    }

    clickAft() {
        for (let i = 0; i <= this.xNum; i++)
            for (let j = 0; j <= this.yNum; j++) {
                let tmp = this.gridList[i][j].select("circle").attr("class");
                if (this.XisChoosed[i] === 0 || this.YisChoosed[j] === 0) {
                    this.gridList[i][j].select("circle").attr("class", tmp.replace(/chosen/, "dechoose"));
                } else {
                    this.gridList[i][j].select("circle").attr("class", tmp.replace(/dechoose/, "chosen"));
                }
            }
    }

    dblClickX(did) {
        if (this.isLocked === 1) return;

        this.deClickX();

        let bid = this.getXBidByDid(did);
        for (let i = 0; i < bid.length; i++) this.XisMerged[bid[i]] = 1 - this.XisMerged[bid[i]];

        let x = 0;
        let count, mcount = 0;
        for (let i = 0; i < this.xGroup.length; i++) {
            count = 0;
            for (let j = 0; j < this.xGroup[i].List.length; j++) {
                let k = this.xGroup[i].List[j].branchID;
                if (this.XisMerged[k] === 0) {
                    count++;
                    this.moveX(k, x);
                    x += this.gridSize;
                } else mcount++;
            }
            x += this.gridSpace;
        }
        x += (mcount - 1) * this.gridSize / 2;
        for (let i = 0; i < this.xGroup.length; i++) {
            for (let j = 0; j < this.xGroup[i].List.length; j++) {
                let k = this.xGroup[i].List[j].branchID;
                if (this.XisMerged[k] === 1)
                    this.moveX(k, x);
            }
        }
    }

    moveX(bid, pos) {
        for (let i = 0; i <= this.yNum; i++) {
            let grid = this.gridList[bid][i];
            let origin_x = grid.attr("x"), origin_y = grid.attr("y");

            grid.transition().duration(300)
                .attr("transform", `translate(${pos},${origin_y})`)
                .attr("x", pos).attr("y", origin_y);
        }
    }

    dblClickY(did) {
        if (this.isLocked === 1) return;

        this.deClickY();

        let bid = this.getYBidByDid(did);
        for (let i = 0; i < bid.length; i++) this.YisMerged[bid[i]] = 1 - this.YisMerged[bid[i]];

        let y = 0;
        let count, mcount = 0;
        for (let i = 0; i < this.yGroup.length; i++) {
            count = 0;
            for (let j = 0; j < this.yGroup[i].List.length; j++) {
                let k = this.yGroup[i].List[j].branchID;
                if (this.YisMerged[k] === 0) {
                    count++;
                    this.moveY(k, y);
                    y += this.gridSize;
                } else mcount++;
            }
            y += this.gridSpace;
        }
        y += (mcount - 1) * this.gridSize / 2;
        for (let i = 0; i < this.yGroup.length; i++) {
            for (let j = 0; j < this.yGroup[i].List.length; j++) {
                let k = this.yGroup[i].List[j].branchID;
                if (this.YisMerged[k] === 1)
                    this.moveY(k, y);
            }
        }
    }

    moveY(bid, pos) {
        for (let i = 0; i <= this.xNum; i++) {
            let grid = this.gridList[i][bid];
            let origin_x = grid.attr("x"), origin_y = grid.attr("y");

            grid.transition().duration(300)
                .attr("transform", `translate(${origin_x},${pos})`)
                .attr("x", origin_x).attr("y", pos);
        }
    }

    deDblClick() {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.xNum; i++) this.XisMerged[i] = 0;
        for (let i = 0; i <= this.yNum; i++) this.YisMerged[i] = 0;

        let grid_x = 0, grid_y = 0;
        for (let ix = 0; ix < this.xGroup.length; ix++) {
            for (let jx = 0; jx < this.xGroup[ix].List.length; jx++) {
                let kx = this.xGroup[ix].List[jx].branchID;
                grid_y = 0;
                for (let iy = 0; iy < this.yGroup.length; iy++) {
                    for (let jy = 0; jy < this.yGroup[iy].List.length; jy++) {
                        let ky = this.yGroup[iy].List[jy].branchID;
                        this.gridList[kx][ky].transition().duration(300)
                            .attr("transform", `translate(${grid_x},${grid_y})`)
                            .attr("x", grid_x).attr("y", grid_y);
                        grid_y += this.gridSize;
                    }
                    grid_y += this.gridSpace;
                }
                grid_x += this.gridSize;
            }
            grid_x += this.gridSpace;
        }
    }

    deDblClickX() {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.xNum; i++) this.XisMerged[i] = 0;

        let x = 0;
        let count, mcount = 0;
        for (let i = 0; i < this.xGroup.length; i++) {
            count = 0;
            for (let j = 0; j < this.xGroup[i].List.length; j++) {
                let k = this.xGroup[i].List[j].branchID;
                if (this.XisMerged[k] === 0) {
                    count++;
                    this.moveX(k, x);
                    x += this.gridSize;
                } else mcount++;
            }
            x += this.gridSpace;
        }
        x += (mcount - 1) * this.gridSize / 2;
        for (let i = 0; i < this.xGroup.length; i++) {
            for (let j = 0; j < this.xGroup[i].List.length; j++) {
                let k = this.xGroup[i].List[j].branchID;
                if (this.XisMerged[k] === 1)
                    this.moveX(k, x);
            }
        }
    }

    deDblClickY() {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.yNum; i++) this.YisMerged[i] = 0;

        let y = 0;
        let count, mcount = 0;
        for (let i = 0; i < this.yGroup.length; i++) {
            count = 0;
            for (let j = 0; j < this.yGroup[i].List.length; j++) {
                let k = this.yGroup[i].List[j].branchID;
                if (this.YisMerged[k] === 0) {
                    count++;
                    this.moveY(k, y);
                    y += this.gridSize;
                } else mcount++;
            }
            y += this.gridSpace;
        }
        y += (mcount - 1) * this.gridSize / 2;
        for (let i = 0; i < this.yGroup.length; i++) {
            for (let j = 0; j < this.yGroup[i].List.length; j++) {
                let k = this.yGroup[i].List[j].branchID;
                if (this.YisMerged[k] === 1)
                    this.moveY(k, y);
            }
        }
    }

    draw() {
        let grid_x = 0, grid_y = 0;

        this.g = this.rootDom.append("g")
            .attr("transform", `translate(${this.cx},${this.cy}) rotate(${this.rotate}) scale(${this.xDir},${this.yDir})`);

        for (let ix = 0; ix < this.xGroup.length; ix++) {
            for (let jx = 0; jx < this.xGroup[ix].List.length; jx++) {
                let kx = this.xGroup[ix].List[jx].branchID;
                grid_y = 0;
                for (let iy = 0; iy < this.yGroup.length; iy++) {
                    for (let jy = 0; jy < this.yGroup[iy].List.length; jy++) {
                        let ky = this.yGroup[iy].List[jy].branchID;
                        this.gridList[kx][ky] = this.g.append("g")
                            .attr("id", `matrix${this.matrixID}_x${kx}_y${ky}`)
                            .attr("transform", `translate(${grid_x},${grid_y})`)
                            .attr("x", grid_x).attr("y", grid_y)
                            .attr("opacity", 1)
                            .on("mouseenter", () => {
                                if (this.isLocked === 1) return;
                                this.father.hoverAttr({
                                    "Player": this.player,
                                    "List": [this.xGroup[ix].List[jx].uniqueID,
                                        this.yGroup[iy].List[jy].uniqueID],
                                });
                                this.father.refreshHint({
                                    "matrixID": this.matrixID,
                                    "x": kx,
                                    "y": ky
                                });
                            })
                            .on("mouseleave", () => {
                                if (this.isLocked === 1) return;
                                this.father.deHover();
                                this.father.removeHint();
                            });
                        this.gridList[kx][ky].append("path")
                            .attr("class", "grid_bg normal")
                            .attr("d", this.getGrid(0, 0, this.gridSize, this.gridSize));
                        let Rparams = {
                            "rootDOM": this.gridList[kx][ky],
                            "cx": this.gridSize / 2,
                            "cy": this.gridSize / 2,
                            "size": this.gridSize - 1,
                        };
                        this.getGridRect(Rparams);
                        let Cparams = {
                            "rootDOM": this.gridList[kx][ky],
                            "cx": this.gridSize / 2,
                            "cy": this.gridSize / 2,
                            "r": 0,
                            "fill": `rgb(0,0,0)`
                        };
                        this.getGridCircle(Cparams);
                        grid_y += this.gridSize;
                    }
                    grid_y += this.gridSpace;
                }
                grid_x += this.gridSize;
            }
            grid_x += this.gridSpace;
        }
    }

    getGrid(x, y, width, height) {
        if (width === 0 || height === 0) return "";
        if (width < 0) {
            x += width;
            width = -width;
        }
        if (height < 0) {
            y += height;
            height = -height;
        }
        return `
        M${x} ${y}
        L${x + width} ${y}
        L${x + width} ${y + height}
        L${x} ${y + height}
        Z`;
    }

    getGridCircle(params) {
        params.rootDOM.append("circle")
            .attr("class", "grid_circle chosen")
            .attr("transform", `translate(${params.cx},${params.cy})`)
            .attr("r", params.r)
            .attr("fill", params.fill);
    }

    getGridRect(params) {
        params.rootDOM.append("rect")
            .attr("class", "grid_rect normal")
            .attr("transform", `translate(${params.cx},${params.cy})`)
            .attr("x", -params.size / 2).attr("y", -params.size / 2)
            .attr("width", params.size).attr("height", params.size);
    }

    getXBidByDid(did) {
        for (let i = 0; i < this.xGroup.length; i++)
            for (let j = 0; j < this.xGroup[i].List.length; j++)
                if (did === this.xGroup[i].List[j].uniqueID)
                    return [this.xGroup[i].List[j].branchID];
        for (let i = 0; i < this.xGroup.length; i++)
            if (did === this.xGroup[i].uniqueID) {
                let ans = [];
                for (let j = 0; j < this.xGroup[i].List.length; j++) {
                    let bid = this.xGroup[i].List[j].branchID;
                    if (this.XisMerged[bid] === 0) ans.push(bid);
                }
                return ans;
            }
        let ans = [];
        for (let i = 0; i < this.xGroup.length; i++)
            for (let j = 0; j < this.xGroup[i].List.length; j++) {
                let bid = this.xGroup[i].List[j].branchID;
                if (this.XisMerged[bid] === 1) ans.push(bid);
            }
        return ans;
    }

    getYBidByDid(did) {
        for (let i = 0; i < this.yGroup.length; i++)
            for (let j = 0; j < this.yGroup[i].List.length; j++)
                if (did === this.yGroup[i].List[j].uniqueID)
                    return [this.yGroup[i].List[j].branchID];
        for (let i = 0; i < this.yGroup.length; i++)
            if (did === this.yGroup[i].uniqueID) {
                let ans = [];
                for (let j = 0; j < this.yGroup[i].List.length; j++) {
                    let bid = this.yGroup[i].List[j].branchID;
                    if (this.YisMerged[bid] === 0) ans.push(bid);
                }
                return ans;
            }
        let ans = [];
        for (let i = 0; i < this.yGroup.length; i++)
            for (let j = 0; j < this.yGroup[i].List.length; j++) {
                let bid = this.yGroup[i].List[j].branchID;
                if (this.YisMerged[bid] === 1) ans.push(bid);
            }
        return ans;
    }
}

class mainMatrices_Bridge {
    constructor(params) {
        this.cx = params.cx;
        this.cy = params.cy;
        this.bridgeLength = params.bridgeLength;
        this.gridSize = params.gridSize;
        this.gridSpace = params.gridSpace;
        this.tagSize = params.tagSize;
        this.xDir = params.xDir;
        this.yDir = params.yDir;
        this.rotate = params.rotate;
        this.rootDom = params.rootDom;
        this.group = params.group;
        this.tagNum = params.tagNum;
        this.father = params.father;
        this.mergeID = params.mergeID;
        this.player = params.player;

        this.gNum = this.group.length;
        this.tNum = this.group[this.gNum - 1].List[this.group[this.gNum - 1].List.length - 1].branchID;
        this.linkList = new Array(this.tNum + 1);
        this.mergeLink = null;
        this.mainTag = new Array(this.gNum + 1);
        this.branchTag = new Array(this.tNum + 1);

        this.isLocked = 0;
        this.isHovered = new Array(this.tNum + 1);
        this.isChoosed = new Array(this.tNum + 1);
        this.isChosen = false;
        this.isMerged = new Array(this.tNum + 1);
        for (let i = 0; i <= this.tNum; i++) {
            this.isHovered[i] = 0;
            this.isChoosed[i] = 1;
            this.isMerged[i] = 0;
        }

        this.draw();
    }

    lock() {
        this.isLocked = 1 - this.isLocked;

        this.g.transition().duration(300).attr("opacity", 1 - this.isLocked);
        // let Class = this.mergeLink.select("path").attr("class");
        // Class = this.isLocked===1?Class.replace(/normal/,"lock"):Class.replace(/lock/,"normal");
        // this.mergeLink.selectAll("path").transition().duration(300).attr("opacity",1-this.isLocked);

        // for(let i = 0; i <= this.tNum; i++) {
        // let Class = this.linkList[i].select("path").attr("class");
        // Class = this.isLocked===1?Class.replace(/normal/,"lock"):Class.replace(/lock/,"normal");
        // this.linkList[i].select("path").transition().duration(300).attr("opacity",1-this.isLocked);

        // Class = this.branchTag[i].select("path").attr("class");
        // Class = this.isLocked===1?Class.replace(/normal/,"lock"):Class.replace(/lock/,"normal");
        // this.branchTag[i].select("path").transition().duration(300).attr("opacity",1-this.isLocked);

        // Class = this.branchTag[i].select("text").attr("class");
        // Class = this.isLocked===1?Class.replace(/normal/,"lock"):Class.replace(/lock/,"normal");
        // this.branchTag[i].select("text").transition().duration(300).attr("opacity",1-this.isLocked);
        // }

        // for(let i = 0; i <= this.gNum; i++) {
        // let Class = this.mainTag[i].select("path").attr("class");
        // Class = this.isLocked===1?Class.replace(/normal/,"lock"):Class.replace(/lock/,"normal");
        // this.mainTag[i].select("path").transition().duration(300).attr("opacity",1-this.isLocked);

        // Class = this.mainTag[i].select("text").attr("class");
        // Class = this.isLocked===1?Class.replace(/normal/,"lock"):Class.replace(/lock/,"normal");
        // this.mainTag[i].select("text").transition().duration(300).attr("opacity",1-this.isLocked);
        // }
    }

    hover(did) {
        if (this.isLocked === 1) return;

        if (this.isChosen) return;
        let bid;
        let gid = this.getGidByDid(did);

        if (gid === this.gNum) {
            bid = new Array();
            for (let i = 0; i <= this.tNum; i++)
                if (this.isMerged[i] === 1) bid.push(i);
        } else bid = this.getBidByDid(did);

        let tmp;

        for (let i = 0; i < bid.length; i++) {
            this.isHovered[bid[i]] = 1;

            tmp = this.linkList[bid[i]].select("path").attr("class");
            this.linkList[bid[i]].select("path").attr("class", tmp.replace(/normal/, "hover"));

            tmp = this.branchTag[bid[i]].selectAll("path").attr("class");
            this.branchTag[bid[i]].selectAll("path").attr("class", tmp.replace(/normal/, "hover"));
            tmp = this.branchTag[bid[i]].selectAll("text").attr("class");
            this.branchTag[bid[i]].selectAll("text").attr("class", tmp.replace(/normal/, "hover"));
        }
        tmp = this.mainTag[gid].selectAll("path").attr("class");
        this.mainTag[gid].selectAll("path").attr("class", tmp.replace(/normal/, "hover"));
        tmp = this.mainTag[gid].selectAll("text").attr("class");
        this.mainTag[gid].selectAll("text").attr("class", tmp.replace(/normal/, "hover"));
    }

    deHover() {
        if (this.isLocked === 1) return;
        if (this.isChosen) return;

        for (let i = 0; i <= this.tNum; i++)
            if (this.isHovered[i] === 1) {
                let tmp;
                tmp = this.linkList[i].select("path").attr("class");
                this.linkList[i].select("path").attr("class", tmp.replace(/hover/, "normal"));

                tmp = this.branchTag[i].selectAll("path").attr("class");
                this.branchTag[i].selectAll("path").attr("class", tmp.replace(/hover/, "normal"));
                tmp = this.branchTag[i].selectAll("text").attr("class");
                this.branchTag[i].selectAll("text").attr("class", tmp.replace(/hover/, "normal"));

                this.isHovered[i] = 0;
            }
        for (let i = 0; i <= this.gNum; i++) {
            let tmp;

            tmp = this.mainTag[i].select("path").attr("class");
            this.mainTag[i].select("path").attr("class", tmp.replace(/hover/, "normal"));
            tmp = this.mainTag[i].select("text").attr("class");
            this.mainTag[i].select("text").attr("class", tmp.replace(/hover/, "normal"));
        }
    }

    click(did) {
        if (this.isLocked === 1) return;

        let bid = this.getBidByDid(did);
        let i;
        for (i = 0; i < bid.length; i++) this.isChoosed[bid[i]]--;
        for (i = 0; i <= this.tNum; i++)
            if (this.isChoosed[i] !== 0) break;
        if (i > this.tNum) {
            for (i = 0; i <= this.tNum; i++) this.isChoosed[i] = 1;
            this.isChosen = !this.isChosen;
        }
        else {
            for (i = 0; i <= this.tNum; i++) this.isChoosed[i] = 0;
            for (i = 0; i < bid.length; i++) this.isChoosed[bid[i]] = 1;
            this.isChosen = true;
        }

        this.clickAft();
    }

    deClick() {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.tNum; i++) this.isChoosed[i] = 1;

        this.isChosen = false;
        this.clickAft();
    }

    clickAft() {
        let tmp, gid, flag;
        for (let i = 0; i <= this.gNum; i++) {
            tmp = this.mainTag[i].selectAll("path").attr("class");
            this.mainTag[i].selectAll("path").attr("class", tmp.replace(/hover/, "normal"));
            tmp = this.mainTag[i].selectAll("text").attr("class");
            this.mainTag[i].selectAll("text").attr("class", tmp.replace(/hover/, "normal"));
        }
        for (let i = 0; i <= this.tNum; i++) {
            tmp = this.linkList[i].select("path").attr("class");
            this.linkList[i].select("path").attr("class", tmp.replace(/hover/, "normal"));

            tmp = this.branchTag[i].selectAll("path").attr("class");
            this.branchTag[i].selectAll("path").attr("class", tmp.replace(/hover/, "normal"));
            tmp = this.branchTag[i].selectAll("text").attr("class");
            this.branchTag[i].selectAll("text").attr("class", tmp.replace(/hover/, "normal"));
        }

        if (this.isChosen)
            for (let j = 0; j <= this.tNum; j++)
                if (this.isChoosed[j] === 1) {
                    tmp = this.branchTag[j].selectAll("path").attr("class");
                    this.branchTag[j].selectAll("path").attr("class", tmp.replace(/normal/, "hover"));
                    tmp = this.branchTag[j].selectAll("text").attr("class");
                    this.branchTag[j].selectAll("text").attr("class", tmp.replace(/normal/, "hover"));

                    gid = this.getGidByBid(j);
                    tmp = this.mainTag[gid].selectAll("path").attr("class");
                    this.mainTag[gid].selectAll("path").attr("class", tmp.replace(/normal/, "hover"));
                    tmp = this.mainTag[gid].selectAll("text").attr("class");
                    this.mainTag[gid].selectAll("text").attr("class", tmp.replace(/normal/, "hover"));
                }
    }

    dblClick(did) {
        if (this.isLocked === 1) return;

        this.deClick();

        let bid = this.getBidByDid(did);
        for (let i = 0; i < bid.length; i++) this.isMerged[bid[i]] = 1 - this.isMerged[bid[i]];

        let y = 0;
        let count;
        for (let i = 0; i < this.gNum; i++) {
            count = 0;
            for (let j = 0; j < this.group[i].List.length; j++) {
                let k = this.group[i].List[j].branchID;
                if (this.isMerged[k] === 0) {
                    count++;
                    this.move(k, y);
                    y += this.gridSize;
                }
            }
            this.resizeTag(i, y - this.gridSize * count, count);
            y += this.gridSpace;
        }
        count = 0;
        for (let i = 0; i < this.gNum; i++) {
            for (let j = 0; j < this.group[i].List.length; j++) {
                let k = this.group[i].List[j].branchID;
                if (this.isMerged[k] === 1) {
                    count++;
                    this.move(k, y);
                    y += this.gridSize;
                }
            }
        }
        this.resizeTag(this.gNum, y - this.gridSize * count, count);
        if (count > 1) this.mergeLink.selectAll("path").attr("d", `M0 0L0 ${this.gridSize * (count - 1)}`);
        else this.mergeLink.selectAll("path").attr("d", `M0 0L0 0`);
    }

    move(bid, pos) {
        this.linkList[bid]
            .transition().duration(300)
            .attr("transform", `translate(0,${pos})`);
        this.branchTag[bid]
            .transition().duration(300)
            .attr("transform", `translate(0,${pos})`);
    }

    resizeTag(tag, bf, count) {
        let mainTag_x = this.gridSpace + this.tagSize + this.gridSpace;
        let mainTag_y = bf;
        let mainTag_width = this.gridSize;
        let mainTag_height = this.gridSize * count;
        this.mainTag[tag]
            .transition().duration(300)
            .attr("transform", `translate(${mainTag_x},${mainTag_y})`);
        this.mainTag[tag].select("path")
            .transition().duration(300)
            .attr("d", this.getTag(0, 0, mainTag_width, mainTag_height));
        this.mainTag[tag].select("text")
            .transition().duration(300)
            .attr("transform", `translate(${mainTag_width / 2},${mainTag_height / 2}) rotate(${this.textRotate(2)}) scale(${this.xDir},${this.yDir})`)
            .text(this.getName(tag < this.gNum ? this.group[tag].Name : "merge", mainTag_height, mainTag_width / 1.4));
    }

    deDblClick() {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.tNum; i++) this.isMerged[i] = 0;

        let y = 0;
        let count;
        for (let i = 0; i < this.gNum; i++) {
            count = 0;
            for (let j = 0; j < this.group[i].List.length; j++) {
                let k = this.group[i].List[j].branchID;
                if (this.isMerged[k] === 0) {
                    count++;
                    this.move(k, y);
                    y += this.gridSize;
                }
            }
            this.resizeTag(i, y - this.gridSize * count, count);
            y += this.gridSpace;
        }
        count = 0;
        for (let i = 0; i < this.gNum; i++) {
            for (let j = 0; j < this.group[i].List.length; j++) {
                let k = this.group[i].List[j].branchID;
                if (this.isMerged[k] === 1) {
                    count++;
                    this.move(k, y);
                    y += this.gridSize;
                }
            }
        }
        this.resizeTag(this.gNum, y - this.gridSize * count, count);
        if (count > 1) this.mergeLink.selectAll("path").attr("d", `M0 0L0 ${this.gridSize * (count - 1)}`);
        else this.mergeLink.selectAll("path").attr("d", `M0 0L0 0`);
    }

    resetLinkClass(Class) {
        if (this.isLocked === 1) return;

        for (let i = 0; i <= this.tNum; i++)
            this.linkList[i].select("path").attr("class", Class);
        this.mergeLink.selectAll("path").attr("class", Class);
    }

    draw() {
        this.g = this.rootDom.append("g")
            .attr("transform", `translate(${this.cx},${this.cy}) rotate(${this.rotate}) scale(${this.xDir},${this.yDir})`)
            .attr("opacity", 1);

        // draw link
        let link_y = 0;
        for (let i = 0; i < this.group.length; i++) {
            for (let j = 0; j < this.group[i].List.length; j++) {
                let k = this.group[i].List[j].branchID;
                this.linkList[k] = this.g.append("g")
                    .attr("transform", `translate(0,${link_y})`);
                this.linkList[k].append("path")
                    .attr("class", "link normal")
                    .attr("d", `M0 ${this.gridSize / 2}L${this.bridgeLength} ${this.gridSize / 2}`);

                link_y += this.gridSize;
            }
            link_y += this.gridSpace;
        }
        this.mergeLink = this.g.append("g");
        this.mergeLink.append("path")
            .attr("class", "link normal")
            .attr("transform", `translate(0,${link_y - this.gridSize / 2}) scale(1,-1)`)
            .attr("d", `M0 0L0 0`);
        if (this.tagNum === 2)
            this.mergeLink.append("path")
                .attr("class", "link normal")
                .attr("transform", `translate(${this.bridgeLength},${link_y - this.gridSize / 2}) scale(1,-1)`)
                .attr("d", `M0 0L0 0`);

        // draw mainTag
        let mainTag_x = this.gridSpace + this.tagSize + this.gridSpace;
        let mainTag_y = 0;
        let mainTag_width = this.gridSize;
        let mainTag_height;
        for (let i = 0; i < this.gNum; i++) {
            mainTag_height = this.group[i].List.length * this.gridSize;
            this.mainTag[i] = this.g.append("g")
                .attr("transform", `translate(${mainTag_x},${mainTag_y})`);
            this.addTagEvent({
                "tag": this.mainTag[i],
                "player": this.player,
                "data": this.group[i].uniqueID,
                "type": "m"
            });
            this.mainTag[i].append("path")
                .attr("class", "mainTag_path normal")
                .attr("d", this.getTag(0, 0, mainTag_width, mainTag_height));
            this.mainTag[i].append("text")
                .attr("class", "mainTag_font normal")
                .attr("transform", `translate(${mainTag_width / 2},${mainTag_height / 2}) rotate(${this.textRotate(2)}) scale(${this.xDir},${this.yDir})`)
                .style("font-size", mainTag_width / 1.4)
                .text(this.getName(this.group[i].Name, mainTag_height, mainTag_width / 1.4));
            mainTag_y += mainTag_height + this.gridSpace;
        }
        mainTag_height = 0;
        this.mainTag[this.gNum] = this.g.append("g")
            .attr("transform", `translate(${mainTag_x},${mainTag_y})`);
        this.addTagEvent({
            "tag": this.mainTag[this.gNum],
            "player": this.player,
            "data": this.group[this.group.length - 1].uniqueID + 1,
            "type": "m"
        });
        this.mainTag[this.gNum].append("path")
            .attr("class", "mainTag_path normal")
            .attr("d", this.getTag(0, 0, mainTag_width, mainTag_height));
        this.mainTag[this.gNum].append("text")
            .attr("class", "mainTag_font normal")
            .attr("transform", `translate(${mainTag_width / 2},${mainTag_height / 2}) rotate(${this.textRotate(2)}) scale(${this.xDir},${this.yDir})`)
            .style("font-size", mainTag_width / 1.4)
            .text(this.getName("merge", mainTag_height, mainTag_width / 1.4));

        // draw branchTag
        let branchTag_x;
        let branchTag_y = 0;
        let branchTag_width = this.tagSize;
        let branchTag_height = this.gridSize;
        for (let i = 0; i < this.group.length; i++) {
            for (let j = 0; j < this.group[i].List.length; j++) {
                let k = this.group[i].List[j].branchID;
                this.branchTag[k] = this.g.append("g")
                    .attr("transform", `translate(0,${branchTag_y})`);
                this.addTagEvent({
                    "tag": this.branchTag[k],
                    "player": this.player,
                    "data": this.group[i].List[j].uniqueID,
                    "type": "b"
                });
                branchTag_x = this.gridSpace;
                for (let l = 0; l < this.tagNum; l++) {
                    this.branchTag[k].append("path")
                        .attr("transform", `translate(${branchTag_x},0)`)
                        .attr("class", "branchTag_path normal")
                        .attr("d", this.getTag(0.1 * branchTag_width, 0.1 * branchTag_height,
                            0.8 * branchTag_width, 0.8 * branchTag_height));
                    this.branchTag[k].append("text")
                        .attr("class", "branchTag_font normal")
                        .attr("transform", `translate(${branchTag_x + branchTag_width / 2},${branchTag_height / 2}) rotate(${this.textRotate(1)}) scale(${this.xDir},${this.yDir})`)
                        .style("font-size", branchTag_height / 1.4)
                        .text(this.getName(this.group[i].List[j].Name, branchTag_width, branchTag_height / 1.4));
                    branchTag_x += this.tagSize + this.gridSpace + this.gridSize + this.gridSpace;
                }
                branchTag_y += this.gridSize;
            }
            branchTag_y += this.gridSpace;
        }
    }

    addTagEvent(params) {
        let tag = params.tag,
            player = params.player,
            data = params.data,
            type = params.type;

        tag
            .on("mouseenter", () => {
                if (this.isLocked === 1) return;
                if (this.getGidByDid(data) === this.gNum && type === "b") return;
                this.father.hoverAttr({
                    "Player": player,
                    "List": [data]
                });
            })
            .on("mouseleave", () => {
                if (this.isLocked === 1) return;
                if (this.getGidByDid(data) === this.gNum && type === "b") return;
                this.father.deHover();
            })
            .on("click", () => {
                if (this.father.pressControl) {
                    if (this.isLocked === 1) return;

                    this.father.dblClickAttr({
                        "Player": player,
                        "List": [data]
                    });
                } else {
                    if (this.isLocked === 1) return;

                    if (this.getGidByDid(data) === this.gNum && type === "b") return;
                    this.father.clickAttr({
                        "Player": player,
                        "List": [data]
                    });
                }
            })
        // .on("dblclick", ()=> {
        //     if(this.isLocked === 1) return;
        //     this.father.dblClickAttr({
        //         "Player": player,
        //         "List": [data]
        //     });
        // })
    }

    getName(name, width, size) {
        let length = parseInt(width / size);
        return name.substring(0, length > name.length ? name.length : length);
    }

    getTag(x, y, width, height) {
        if (width === 0 || height === 0) return "";
        if (width < 0) {
            x += width;
            width = -width;
        }
        if (height < 0) {
            y += height;
            height = -height;
        }
        let radius = 0.2 * (width > height ? height : width);
        return `
        M${x + radius} ${y}
        L${x + width - radius} ${y}
        Q${x + width} ${y}
        ${x + width} ${y + radius}
        L${x + width} ${y + height - radius}
        Q${x + width} ${y + height}
        ${x + width - radius} ${y + height}
        L${x + radius} ${y + height}
        Q${x} ${y + height}
        ${x} ${y + height - radius}
        L${x} ${y + radius}
        Q${x} ${y}
        ${x + radius} ${y}
        `;
    }

    getBidByDid(did) {
        for (let i = 0; i < this.gNum; i++)
            for (let j = 0; j < this.group[i].List.length; j++)
                if (did === this.group[i].List[j].uniqueID)
                    return [this.group[i].List[j].branchID];
        for (let i = 0; i < this.gNum; i++)
            if (did === this.group[i].uniqueID) {
                let ans = [];
                for (let j = 0; j < this.group[i].List.length; j++) {
                    let bid = this.group[i].List[j].branchID;
                    if (this.isMerged[bid] === 0) ans.push(bid);
                }
                return ans;
            }
        let ans = [];
        for (let i = 0; i < this.gNum; i++)
            for (let j = 0; j < this.group[i].List.length; j++) {
                let bid = this.group[i].List[j].branchID;
                if (this.isMerged[bid] === 1) ans.push(bid);
            }
        return ans;
    }

    getGidByDid(did) {
        for (let i = 0; i < this.gNum; i++)
            for (let j = 0; j < this.group[i].List.length; j++)
                if (did === this.group[i].List[j].uniqueID)
                    if (this.isMerged[this.group[i].List[j].branchID] === 1) return this.gNum;
                    else return i;
        for (let i = 0; i < this.gNum; i++)
            if (did === this.group[i].uniqueID) return i;
        return this.gNum;
    }

    getGidByBid(bid) {
        for (let i = 0; i < this.gNum; i++)
            for (let j = 0; j < this.group[i].List.length; j++)
                if (bid === this.group[i].List[j].branchID)
                    if (this.isMerged[this.group[i].List[j].branchID] === 1) return this.gNum;
                    else return i;
    }

    textRotate(level) {
        while (this.rotate < 0) this.rotate += 360;
        while (this.rotate >= 360) this.rotate -= 360;
        if (level === 1)
            if (this.rotate < 90 || this.rotate >= 270) return 0;
            else return 180;

        if (level === 2)
            if (this.rotate < 180) return -90 * this.xDir * this.yDir;
            else return 90 * this.xDir * this.yDir;
    }
}
