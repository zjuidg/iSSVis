let calcRate_Avai = function(data) {
  //状态转移矩阵计数
  let count_tech = matrixInit(22);//发球 + 9种技术（编号1-9） + 得分
  let count_pos = matrixInit(12);//发球 + 4个身位（编号1-4） + 得分
  let count_ballpos = matrixInit(22);//发球 + 9个落点（编号0-8） + 得分

  data.forEach((game) => {
    game.forEach((Rally) => {
      let rally = Rally.strokes;
      rally.forEach((stroke, index) => {
        //==============available=================
        let available = {};
        if(index == 0) available.tech = {};
        else {
          available.tech = techStat[rally[index-1].tech];
        }
        available.ballpos = ballposStat[stroke.tech];
        available.pos = posStat[stroke.tech + '_' + stroke.ballpos];

        stroke.available = available;


        let last_rate = {};
        if(index == 0) {
          //tech
          let techPmatrix = PforMatrix(count_tech);
          let techRate = getRate_serve(techPmatrix);
          last_rate.tech = techRate.slice(techRate.length - 2)[stroke.hitplayer];

          //pos
          let posPmatrix = PforMatrix(count_pos);
          let posRate = getRate_serve(posPmatrix);
          last_rate.pos = posRate.slice(posRate.length - 2)[stroke.hitplayer];

          //ballpos
          last_rate.ballpos = 1;//第一拍的ballpos胜率为绝对值
        }
        else {
          last_rate.tech = stroke.winning_rate_abs.tech[stroke.tech];
          last_rate.pos = stroke.winning_rate_abs.pos[stroke.pos];
          last_rate.ballpos = rally[index - 1].winning_rate_abs.ballpos[stroke.ballpos];
        }
        //==============winning_rate==============
        if(stroke.win < 0) {//不是得分拍
          //---------------------------tech--------------------加到下一拍
          let tech_rate_abs = {};
          let tech_rate = {};

          for(let i = 1; i <= 9; i ++) {//遍历9个编号
            //拷贝复制count_tech
            let tempCountMatrix = count_tech.map((row) => {
              let rowCopy = row.map((item) => {
                return item;
              });
              return rowCopy;
            });

            let tryStroke = {};
            tryStroke.win = stroke.win;
            tryStroke.serve = stroke.serve;
            tryStroke.hitplayer = stroke.hitplayer;
            tryStroke.tech = stroke.tech;
            tryStroke.next_tech = i;

            accumCountMatrix(tempCountMatrix, "tech", tryStroke);//累计尝试拍并计算尝试胜率

            let Pmatrix = PforMatrix(tempCountMatrix);
            let rate = getRate_serve(Pmatrix);

            tech_rate_abs[i] = rate.slice(rate.length - 2)[+!stroke.hitplayer]
            tech_rate[i] = tech_rate_abs[i] - (1 - last_rate.tech);
            //tryhitplayer与HitPlayer相反（tryhitplayer等于下一拍的HitPlayer）
            if(tech_rate[i] < -1 || tech_rate[i] > 1) {
              console.log("now: " + tech_rate_abs[i]);
              console.log("last: " + last_rate.tech);
            }
          }
          rally[index + 1].winning_rate = {};//初始化下一拍winning_rate;
          rally[index + 1].winning_rate_abs = {};
          rally[index + 1].winning_rate.tech = tech_rate;
          rally[index + 1].winning_rate_abs.tech = tech_rate_abs;


          //-------------------------pos--------------------加到下一拍
          let pos_rate_abs = {};
          let pos_rate = {};

          for(let i = 1; i <= 4; i ++) {//遍历9个编号
            //拷贝复制count_pos
            let tempCountMatrix = count_pos.map((row) => {
              let rowCopy = row.map((item) => {
                return item;
              });
              return rowCopy;
            });

            let tryStroke = {};
            tryStroke.win = stroke.win;
            tryStroke.serve = stroke.serve;
            tryStroke.hitplayer = stroke.hitplayer;
            tryStroke.pos = stroke.pos;
            tryStroke.next_pos = i;

            accumCountMatrix(tempCountMatrix, "pos", tryStroke);//累计尝试拍并计算尝试胜率

            let Pmatrix = PforMatrix(tempCountMatrix);
            let rate = getRate_serve(Pmatrix);

            pos_rate_abs[i] = rate.slice(rate.length - 2)[+!stroke.hitplayer]
            pos_rate[i] = pos_rate_abs[i] - (1 - last_rate.pos);
            //tryhitplayer与HitPlayer相反（tryhitplayer等于下一拍的HitPlayer）
            // console.log(pos_rate[i]);
          }
          rally[index + 1].winning_rate.pos = pos_rate;
          rally[index + 1].winning_rate_abs.pos = pos_rate_abs;

          //----------------------ballpos---------------------加到当前拍
          let ballpos_rate = {};
          let ballpos_rate_abs = {};

          for(let i = 0; i <= 8; i ++) {//遍历9个编号
            //拷贝复制count_ballpos
            let tempCountMatrix = count_ballpos.map((row) => {
              let rowCopy = row.map((item) => {
                return item;
              });
              return rowCopy;
            });

            let tryStroke = {};
            tryStroke.win = stroke.win;
            tryStroke.serve = stroke.serve;
            tryStroke.hitplayer = stroke.hitplayer;
            tryStroke.last_ballpos = stroke.last_ballpos;
            tryStroke.ballpos = i;

            accumCountMatrix(tempCountMatrix, "ballpos", tryStroke);//累计尝试拍并计算尝试胜率

            let Pmatrix = PforMatrix(tempCountMatrix);
            let rate = getRate_serve(Pmatrix);

            ballpos_rate_abs[i] = rate.slice(rate.length - 2)[stroke.hitplayer]
            ballpos_rate[i] = ballpos_rate_abs[i] - (1 - last_rate.ballpos);
            //tryhitplayer与HitPlayer相同
          }
          if(!("winning_rate" in stroke)) {
            stroke.winning_rate = {};
            stroke.winning_rate_abs = {};
          }
          stroke.winning_rate.ballpos = ballpos_rate;
          stroke.winning_rate_abs.ballpos = ballpos_rate_abs;

        }
        else {//若是得分拍，无法测试不同行为(除了落点多记录的一条信息)
          if(stroke.ballpos != -1) {//可以测试落点行为
            //----ballpos-----加到当前拍
            let ballpos_rate = {};

            for(let i = 0; i <= 8; i ++) {//遍历9个编号
              //拷贝复制count_ballpos
              let tempCountMatrix = count_ballpos.map((row) => {
                let rowCopy = row.map((item) => {
                  return item;
                });
                return rowCopy;
              });

              let tryStroke = {};
              tryStroke.win = stroke.win;
              tryStroke.serve = stroke.serve;
              tryStroke.hitplayer = stroke.hitplayer;
              tryStroke.last_ballpos = stroke.last_ballpos;
              tryStroke.ballpos = i;

              accumCountMatrix(tempCountMatrix, "ballpos", tryStroke);//累计尝试拍并计算尝试胜率

              let Pmatrix = PforMatrix(tempCountMatrix);
              let rate = getRate_serve(Pmatrix);

              ballpos_rate[i] = rate.slice(rate.length - 2)[stroke.hitplayer];
              //tryhitplayer与HitPlayer相同
            }
            if(!("winning_rate" in stroke)) stroke.winning_rate = {};
            stroke.winning_rate.ballpos = ballpos_rate;
          }
        }

        //累加当前拍状态转移到三个状态转移矩阵
        accumCountMatrix(count_tech, "tech", stroke);
        accumCountMatrix(count_pos, "pos", stroke);
        accumCountMatrix(count_ballpos, "ballpos", stroke);
      });
    });
  });

  //再遍历一次修改胜率为上一拍胜率差值
  data.forEach((game) => {
    game.forEach((Rally) => {
      let rally = Rally.strokes;
      rally.forEach((stroke, index) => {

      });
    });
  });
  // console.log(data);
}


let matrixInit = function(dim) {
	let matrix = [];
	for(let i = 0; i < dim; i ++) {
		matrix.push([]);
		for(let j = 0; j < dim; j ++) {
			matrix[i][j] = 0;
		}
	}
	return matrix;
}

let PforMatrix = function(matrix) {
		let sumArray = [];
		//rowSum
		matrix.forEach((row) => {
			let sum = 0;
			row.forEach((item) => {
				sum += item;
			});
			sumArray.push(sum);
		});

		//caculate possibility
		let Pmatrix = matrixInit(matrix.length);
		matrix.forEach((row, indexr) => {
			row.forEach((item, indexl) => {
				if(indexr >=  matrix.length - 2) {//得分吸收
					if(indexr == indexl) Pmatrix[indexr][indexl] = 1;
					else Pmatrix[indexr][indexl] = 0;
				}
				else if(sumArray[indexr] == 0) {
					Pmatrix[indexr][indexl] = 0;
				}
				else
				Pmatrix[indexr][indexl] = item/sumArray[indexr];
			});
		});

		// console.log(Pmatrix);
		return Pmatrix;
}

let accumCountMatrix = function(countMatrix, attr, stroke) {
  let dim = countMatrix.length;
  if(stroke.win < 0){//不是得分拍
    if(attr == "ballpos") {//ballpos的next才是hitplayer的对应
      if(stroke.serve) {
        //同一人中的转移，另外0在ballpos中为有意义编号（不是发球），在转移矩阵中+1留出记录发球状态的位置
        countMatrix[stroke.hitplayer][(stroke[attr] + 1) *2+stroke.hitplayer] ++;
      }
      else
      countMatrix[(stroke["last_" + attr] + 1) *2 + !stroke.hitplayer][(stroke[attr] + 1) *2 + stroke.hitplayer] ++;
    }
    else //发球编号为0，不用单独列出
    countMatrix[stroke[attr] *2 + stroke.hitplayer][stroke["next_" + attr] * 2 + !stroke.hitplayer] ++;
  }
  else {//是得分拍
    if(stroke.win == 0) {//win == 0 -- 失分
      if(attr == "ballpos") {
        if(stroke["ballpos"] == -1){//下一状态就是失分，不用增加状态
          stroke.hitplayer ? countMatrix[(stroke["last_ballpos"] + 1) *2][dim - 2] ++ : countMatrix[(stroke["last_ballpos"] + 1) * 2 +1][dim - 1] ++;
          //hitplayer == 0/A: 行击球人为B，行加一，列为“得分B”
          //hitplayer == 1/B: 行击球人为A, 行不加一，列为“得分A”
        }
        else {
          countMatrix[(stroke["last_" + attr] + 1) *2 + !stroke.hitplayer][(stroke[attr] + 1) *2 + stroke.hitplayer] ++;
          //与非得分拍相同

          stroke.hitplayer ? countMatrix[(stroke["ballpos"]+1) *2 + 1][dim - 2] ++ : countMatrix[(stroke["ballpos"]+1) * 2][dim - 1] ++;
          //补上失分状态
          console.log("error in accumCountMatrix()");
        }
      }
      else
      stroke.hitplayer ? countMatrix[stroke[attr] *2 + 1][dim - 2] ++ : countMatrix[stroke[attr] * 2][dim - 1] ++;
      //hitplayer == 0/A: 行不加一，列为“得分B”
      //hitplayer == 1/B: 行加一，列为“得分A”
    }
    else {//得分
      if(attr == "ballpos") {
        if(stroke["ballpos"] == -1) {//下一状态就是得分，不用增加状态
          stroke.hitplayer ? countMatrix[(stroke["last_ballpos"]+1) *2][dim - 1] ++ : countMatrix[(stroke["last_ballpos"] + 1) * 2 +1][dim - 2] ++;
          //hitplayer == 0/A: 行击球人为B，行加一，列为“得分A”
          //hitplayer == 1/B: 行击球人为A, 行不加一，列为“得分B”
          console.log("error2 in accumCountMatrix()");
        }
        else {
          countMatrix[(stroke["last_" + attr] + 1) *2 + !stroke.hitplayer][(stroke[attr] + 1) *2 + stroke.hitplayer] ++;
          //与非得分拍相同

          stroke.hitplayer ? countMatrix[(stroke["ballpos"]+1) *2 + 1][dim - 1] ++ : countMatrix[(stroke["ballpos"]+1) * 2][dim - 2] ++;
          //补上得分状态
        }
      }
      else
      stroke.hitplayer ? countMatrix[stroke[attr] * 2 + 1][dim - 1] ++ : countMatrix[stroke[attr] * 2][dim - 2] ++;
      //hitplayer == 0/A: 行不加一，列为“得分A”
      //hitplayer == 1/B: 行加一，列为“得分B”
    }
  }
}

let precision = 1e-5;//停止转移精度

//发球各0.5
let getRate_serve = function(PMatrix) {
	let dim = PMatrix.length;
	let initState = [];
	for(let i = 0; i < dim; i ++) {
		if(i < 2) initState.push(0.5);
		else initState.push(0);
	}
	// console.log(initState);
		let result = initState;
		let now = new Array(dim);
    let count = 0;
		do{
			now = result;
			result = numeric.dot(now, PMatrix);
      count ++;
			// console.log(result);
		} while(Math.abs(result[dim-1] - now[dim-1]) > precision ||
		 				Math.abs(result[dim-2] - now[dim-2]) > precision ||
						((result[dim-1]==0 || result[dim-2]==0) && count < 20));
    // console.log(count);
		// console.log(result);
		return result;
}
