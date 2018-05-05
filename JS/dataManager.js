class dataManager {
    constructor() {
    	this.data;
    	this.read_store();
    }
    trans(s1, v1){
		let ballpos = [2,5,8,1,4,7,0,3,6,9];
		let pos = [0, 2, 3, 4, 1]
		if (s1 == "ballpos"){//***总结***最后得到的落点有-1,9,0~8这10种,-1为空落点，不用管，9为意外球不用管，0~8为需要考虑的选项
			if(parseInt(v1) <= 4){//输入落点标号小于4，为发球起点，没有落点意义，记为-1
				if(parseInt(v1) <= 2){
					return -1;
				}
				else{
					return -1;
				}
			}
			if(parseInt(v1) <= 24){//输入落点标号5~24，为正常落点
				return ballpos[Math.floor((parseInt(v1)-3)/2-1)];
				//第一步Math.floor((parseInt(v1)-3)/2-1)正常落点先通过一系列处理为0~9,
				//第二步ballpos[Math.floor((parseInt(v1)-3)/2-1)],再根据一定需求换序号
			}
			else{//输入落点标>=25，为得分失分拍，没有落点意义，记为-1
				return -1;
			}
		}
		if (s1 == "tech"){//***总结***最后得到的技术有-1,10,0~9这12种,-1为空技术，不用管，11为其他技术不用管，0~9为需要考虑的选项(0为发球可以不计入胜率计算的矩阵)
			if (parseInt(v1) <= 24){//输入技术标号0~24，为正常技术
				let tmp =  Math.floor((parseInt(v1)+1)/2-1);
				if (tmp >= 2){//弧圈和快攻合并
					return tmp - 1;
				}
				return tmp;
			}
			else{//输入技术标号>=25，为得分失分拍，没有技术意义，记为-1
				return -1;
			}

		}
		if (s1 == "pos"){//***总结***最后得到的技术有-1, 0~4这5种,-1为空技术，不用管，0~4为需要考虑的选项(0为发球可以不计入胜率计算的矩阵)
			let temp = parseInt(v1);
			if (temp <= 12){//输入技术标号0~12，为正常位置
				if (temp <= 4){//输入技术标号0~4，为发球，记为0
					return 0;
				}//输入技术标号0~4
				return pos[Math.floor((parseInt(v1)-3)/2)];
				//第一步Math.floor((parseInt(v1)-3)/2)正常位置先通过一系列处理为1~4,
				//第二步pos[Math.floor((parseInt(v1)-3)/2)],再根据一定需求换序号,
			}
			else{//输入技术标号>=13，为得分失分拍，没有位置意义，记为-1
				return -1;
			}
		}
		if (s1 == "effect"){
			let temp = parseInt(v1);
			if(Math.ceil(temp/2) == 0){
				return 3;
			}
			return Math.ceil(temp/2);
		}
	}
	read_store(){
		//if strike_effect == 0, let it be 5 or 6
		d3.csv("SRC/system/W_vs_L_07.07.26.csv", (error, csvdata)=>{
			let csvdata_ = [];
			let game_seq = 0;
			let rally_seq = 0;
			let stroke_seq = 0;
			let Wang = "王皓";
			let Wang_is_A = 0;
			//let Wang = csvdata[1]["HitPlayer"];

			//read the data and store it as csvdata_
			for(let i = 0; i < csvdata.length; i++){
				let temp_stroke_all = csvdata[i];
				if (temp_stroke_all["RallyNo"] == "0"|| temp_stroke_all["NextStrikeTech"] == "0"){
					continue;
				}
				if (temp_stroke_all["GameNo"] != game_seq){
					csvdata_.push([]);//add a new game
					game_seq += 1;
					rally_seq = 0;
					stroke_seq = 0;
					let temp_rally = {};
					let score = [];
					if(Wang_is_A){
						score.push(parseInt(temp_stroke_all["ScoreA1"]));
						score.push(parseInt(temp_stroke_all["ScoreB1"]));
					}
					else{
						score.push(parseInt(temp_stroke_all["ScoreB1"]));
						score.push(parseInt(temp_stroke_all["ScoreA1"]));

					}


					temp_rally["score"] = score;
					temp_rally["strokes"] = [];
					csvdata_[game_seq-1].push(temp_rally);//add a the first rally to the new game
					rally_seq = 1;

					let temp_stroke = {};
					if(temp_stroke_all["HitPlayer"] == Wang){
						temp_stroke["hitplayer"] = 0;
					}
					else{
						temp_stroke["hitplayer"] = 1;
					}
					temp_stroke["tech"] = this.trans("tech", temp_stroke_all["StrikeTech"]);
					temp_stroke["pos"] = this.trans("pos", temp_stroke_all["StrikePosition"]);
					if(temp_stroke["tech"] == 0){
						temp_stroke["pos"] = 0;
					}

					temp_stroke["next_pos"] = this.trans("pos", temp_stroke_all["NextStrikePosition"]);
					temp_stroke["next_tech"] = this.trans("tech", temp_stroke_all["NextStrikeTech"]);

					temp_stroke["ballpos"] = this.trans("ballpos", temp_stroke_all["NextBallPosition"]);
					temp_stroke["last_ballpos"] = this.trans("ballpos", temp_stroke_all["BallPosition"]);
					temp_stroke["effect"] = this.trans("effect", temp_stroke_all["StrikeEffect"]);
					temp_stroke["serve"] = 1;
					// if (temp_stroke_all["NextStrikeTech"] == "25" && temp_stroke_all["HitPlayer"] == Wang||temp_stroke_all["NextStrikeTech"] == "26" && temp_stroke_all["HitPlayer"] != Wang){
					if (temp_stroke_all["NextStrikeTech"] == "25" || temp_stroke_all["NextStrikeTech"] == "26" ){
						if (temp_stroke_all["NextBallPosition"] != "25" && temp_stroke_all["NextBallPosition"] != "26" ){
							temp_stroke["win"] = 1;
							temp_stroke["next_pos"] = -1
							temp_stroke["next_tech"] = -1
						}
						else {
							temp_stroke["win"] = 0;
							temp_stroke["next_pos"] = -1
							temp_stroke["next_tech"] = -1
						}
					}
					else {
						temp_stroke["win"] = -1;
					}
					csvdata_[game_seq-1][rally_seq-1]["strokes"].push(temp_stroke);//add a the first stroke to the new rally
					stroke_seq = 1;
				}
				else if (temp_stroke_all["RallyNo"] != rally_seq){
					let temp_rally = {};
					let score = [];
					if(Wang_is_A){
						score.push(parseInt(temp_stroke_all["ScoreA1"]));
						score.push(parseInt(temp_stroke_all["ScoreB1"]));
					}
					else{
						score.push(parseInt(temp_stroke_all["ScoreB1"]));
						score.push(parseInt(temp_stroke_all["ScoreA1"]));

					}
					temp_rally["score"] = score;
					temp_rally["strokes"] = [];
					csvdata_[game_seq-1].push(temp_rally);//add a new rally to the new game
					rally_seq += 1;
					stroke_seq = 0;

					let temp_stroke = {};
					if(temp_stroke_all["HitPlayer"] == Wang){
						temp_stroke["hitplayer"] = 0;
					}
					else{
						temp_stroke["hitplayer"] = 1;
					}
					temp_stroke["tech"] = this.trans("tech", temp_stroke_all["StrikeTech"]);
					temp_stroke["pos"] = this.trans("pos", temp_stroke_all["StrikePosition"]);
					if(temp_stroke["tech"] == 0){
						temp_stroke["pos"] = 0;
					}

					temp_stroke["next_pos"] = this.trans("pos", temp_stroke_all["NextStrikePosition"]);
					temp_stroke["next_tech"] = this.trans("tech", temp_stroke_all["NextStrikeTech"]);

					temp_stroke["ballpos"] = this.trans("ballpos", temp_stroke_all["NextBallPosition"]);
					temp_stroke["last_ballpos"] = this.trans("ballpos", temp_stroke_all["BallPosition"]);
					temp_stroke["effect"] = this.trans("effect", temp_stroke_all["StrikeEffect"]);
					temp_stroke["serve"] = 1;
					// temp_stroke["next_ballpos"] = temp_stroke_all["NextBallPosition"];
					if (temp_stroke_all["NextStrikeTech"] == "25" || temp_stroke_all["NextStrikeTech"] == "26" ){
						if (temp_stroke_all["NextBallPosition"] != "25" && temp_stroke_all["NextBallPosition"] != "26" ){
							temp_stroke["win"] = 1;
							temp_stroke["next_pos"] = -1
							temp_stroke["next_tech"] = -1
						}
						else {
							temp_stroke["win"] = 0;
							temp_stroke["next_pos"] = -1
							temp_stroke["next_tech"] = -1
						}
					}
					else {
						temp_stroke["win"] = -1;
					}
					csvdata_[game_seq-1][rally_seq-1]["strokes"].push(temp_stroke);//add a the first stroke to the new rally
					stroke_seq = 1;
				}
				else {
					let temp_stroke = {};
					if(temp_stroke_all["HitPlayer"] == Wang){
						temp_stroke["hitplayer"] = 0;
					}
					else{
						temp_stroke["hitplayer"] = 1;
					}
					temp_stroke["tech"] = this.trans("tech", temp_stroke_all["StrikeTech"]);
					temp_stroke["pos"] = this.trans("pos", temp_stroke_all["StrikePosition"]);
					if(temp_stroke["tech"] == 0){
						temp_stroke["pos"] = 0;
					}

					temp_stroke["next_pos"] = this.trans("pos", temp_stroke_all["NextStrikePosition"]);
					temp_stroke["next_tech"] = this.trans("tech", temp_stroke_all["NextStrikeTech"]);

					temp_stroke["ballpos"] = this.trans("ballpos", temp_stroke_all["NextBallPosition"]);
					temp_stroke["last_ballpos"] = this.trans("ballpos", temp_stroke_all["BallPosition"]);
					temp_stroke["effect"] = this.trans("effect", temp_stroke_all["StrikeEffect"]);
					temp_stroke["serve"] = 0;
					if (temp_stroke_all["NextStrikeTech"] == "25" || temp_stroke_all["NextStrikeTech"] == "26" ){
						if (temp_stroke_all["NextBallPosition"] != "25" && temp_stroke_all["NextBallPosition"] != "26" ){
							temp_stroke["win"] = 1;
							temp_stroke["next_pos"] = -1
							temp_stroke["next_tech"] = -1
						}
						else {
							temp_stroke["win"] = 0;
							temp_stroke["next_pos"] = -1
							temp_stroke["next_tech"] = -1
						}
					}
					else {
						temp_stroke["win"] = -1;
					}
					csvdata_[game_seq-1][rally_seq-1]["strokes"].push(temp_stroke);//add a the first stroke to the new rally
					stroke_seq += 1;
				}
			}
			this.data = csvdata_;
			READ_DATA = 1;
		});

	}
}
