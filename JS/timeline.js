class mainTimeline {
    constructor() {
        this.div = d3.select("#TIMELINE");
        this.div_height = parseInt(this.div.style("height").split("p")[0]);
        this.svg_main = this.div.append("svg").attr("id", "svg_main");
        this.svg_main_g = this.svg_main.append("g").attr("id","svg_main_g");
        this.svg_main_g_add = this.svg_main.append("g").attr("id","svg_main_g_add");

        this.svg_score = this.div.append("svg").attr("id", "svg_score");
        this.svg_score_g = this.svg_score.append("g").attr("id", "svg_score_g");

        this.svg_button = this.div.append("svg").attr("id", "svg_button");
        this.svg_button_g = this.svg_button.append("g").attr("id", "svg_score_g");
        //state
        this.requireDict = {"player1":{"display" : 1, "prior":{"filter":0, "tech":{"4": 1, "5": 1, "6": 1}, "ballpos":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1},"pos":{"0":1,"1":1,"2":1,"3":1,"4":1}},"current":{"filter":0, "tech":{"1": 1}, "ballpos":{"0":1,"1":1,"2":1,"3":1,"4":1,"5":1,"6":1,"7":1,"8":1},"pos":{"0":1,"1":1,"2":1,"3":1,"4":1}},"next":{"filter":0}},"player0":{"display" : 0}, "player0&player1":{"display" : 0}};
        this.infoArray = [];
        this.rect_height = 50;
            // data process func
            // console.log(GLOBAL_DATA.data);
            this.dataTransform();
            // console.log(this.infoArray);
            this.svg_main_width = parseInt(this.svg_main.style("width").split("p")[0]);
            let total_5 = 50*6+4*5+2*20 + 50*6+4*5+2*20 + 85*3+2*8 + 50*6+4*5+2*20 + 50*6+4*5+2*20 + 2*20;//1751
            let total_3 = 50*6+4*5+2*20 + 85*3+2*8 +  50*6+4*5+2*20 + 2*10;//1011, 1751/1011 = 1.73
            this.svg_main_move_width = (50*6+4*5+2*20)/total_5*this.svg_main_width;
            // console.log(this.svg_main_move_width);
            this.sma_gap_height = this.svg_main_width/total_5*5;

        this.tree_seq = 0;
        this.detail_seq = 0;
        this.icon1_dict = {};
        this.icon2_dict = {};
        this.tactic_state = "middle";
        this.svg_main.style("height", this.infoArray.length * (this.rect_height + this.sma_gap_height) + 50);
        this.svg_score.style("height", this.infoArray.length * (this.rect_height + this.sma_gap_height) + 50);
        this.svg_button.style("height", this.infoArray.length * (this.rect_height + this.sma_gap_height) + 50);
        this.playerTop = 1;
        // this.playerBottom = 0;
        this.num_player = 1;
        this.shorter_length;

        //distance
        this.extend_dis = 50;
        this.extend_height_gap = 10;
        this.extend_width_more = 10;
        this.top_gap = 0;
        this.big_rect_width = this.svg_main_width/total_5*85;
        this.sma_rect_width = this.svg_main_width/total_5*50;
        this.big_sma_rate = this.big_rect_width/this.sma_rect_width;
        this.column_gap_width = this.svg_main_width/total_5*20;
        this.big_gap_width = this.svg_main_width/total_5*8;
        this.sma_gap_width = this.svg_main_width/total_5*5;
        this.LLFlow_x0 = this.column_gap_width;
        this.LLWinRate_x0 = this.LLFlow_x0 + this.sma_rect_width*3 + this.sma_gap_width*2 + this.column_gap_width*1;
        this.LFlow_x0 = this.LLFlow_x0 + this.sma_rect_width*6 + this.sma_gap_width*4 + this.column_gap_width*2;
        this.LWinRate_x0 = this.LFlow_x0 + this.sma_rect_width*3 + this.sma_gap_width*2 + this.column_gap_width*1;
        this.Flow_x0 = this.LFlow_x0 + this.sma_rect_width*6 + this.sma_gap_width*4 + this.column_gap_width*2;
        this.RWinRate_x0 = this.Flow_x0 + this.big_rect_width*3 + this.big_gap_width*2 + this.column_gap_width*1;
        this.RFlow_x0 = this.Flow_x0 + this.big_rect_width*3 + this.big_gap_width*2 + this.sma_rect_width*3 + this.sma_gap_width*2 + this.column_gap_width*2;
        this.RRWinRate_x0 = this.RFlow_x0 + this.sma_rect_width*3 + this.sma_gap_width*2 + this.column_gap_width*1;
        this.RRFlow_x0 = this.RFlow_x0 + this.sma_rect_width*6 + this.sma_gap_width*4 + this.column_gap_width*2;

        this.score_r = 3;

        this.scroll = 0;
        //p

        this.paint_main();
        this.paint_button();
        this.paint_score();
    }
    initial(requireDict){
        this.svg_main.selectAll("*").remove();
        this.svg_score.selectAll("*").remove();
        this.svg_button.selectAll("*").remove();
        overview.svg_overview.selectAll("*").remove();
        
        //get requireDict and calculate infoArray
        //meanwhile, the playerTop, num_player is reassigned
        this.requireDict = requireDict;
        this.dataTransform();

        this.icon1_dict = {};
        this.icon2_dict = {};

        this.tactic_state = "middle";
        top_timeline.svg_top_main.selectAll("g#g_top_main")
            .transition('position')
            .duration(750)
            .attr("transform", `translate(${0},${0})`);

        this.svg_main.style("height", this.infoArray.length * (this.rect_height + this.sma_gap_height) + 50);
        this.svg_score.style("height", this.infoArray.length * (this.rect_height + this.sma_gap_height) + 50);
        this.svg_button.style("height", this.infoArray.length * (this.rect_height + this.sma_gap_height) + 50);

        if(overview.high_or_middle == "high"){
            overview.svg_overview.style("height", timeline.infoArray.length*overview.height_high + 50);
            overview.svg_overview_height = parseInt(overview.svg_overview.style("height").split("p")[0]);
        }
        else{
            overview.svg_overview.style("height", timeline.infoArray.length*overview.height_middle + 50);
            overview.svg_overview_height = parseInt(overview.svg_overview.style("height").split("p")[0]);
        }


        this.svg_main_g = this.svg_main.append("g").attr("id","svg_main_g");
        this.svg_main_g_add = this.svg_main.append("g").attr("id","svg_main_g_add");
        this.svg_score_g = this.svg_score.append("g").attr("id", "svg_score_g");
        this.svg_button_g = this.svg_button.append("g").attr("id", "svg_score_g");
        overview.svg_overview_g = overview.svg_overview.append("g").attr("id", "svg_overview_g");

        this.paint_main();
        this.paint_button();
        this.paint_score();
        overview.paint();

        // menu.initial();
        //……
    }
    dataTransform(){
        let this_ = this;

        let game_score = [[0,0]];
        let data = GLOBAL_DATA.data;
        console.log(data)
        this_.infoArray = [];

        let infoArray_0 = [],
            infoArray_1 = [];


        //calculate game score
        for (let i = 0; i < data.length; i++){
            let length = data[i].length;
            let score = data[i][length - 1]["score"];
            let tmp_score = game_score[game_score.length - 1];
            if (score[0] > score[1]){
                game_score.push([tmp_score[0] + 1, tmp_score[1]]);
            }
            else{
                game_score.push([tmp_score[0], tmp_score[1] + 1]);
            }
        }
       
        if (this_.requireDict["player0"]["display"] == 1){
            this_.num_player = 1;

            let count_stroke = -1;
            for(let i = 0; i < data.length; i++){
                for(let j = 0; j < data[i].length; j++){
                    for (let k = 0; k < data[i][j]["strokes"].length; k++){
                        let score = data[i][j]["score"];
                        let rally = data[i][j]["strokes"];
                        count_stroke += 1;

                        if(rally[k]["hitplayer"] == 1){
                            continue;
                        }
                        if(this_.requireDict["player0"]["prior"]["filter"] == 1){
                            if (k == 0){
                                continue;
                            }
                            if ((rally[k-1]["tech"] in this_.requireDict["player0"]["prior"]["tech"])&&(rally[k-1]["ballpos"] in this_.requireDict["player0"]["prior"]["ballpos"])&&(rally[k-1]["pos"] in this_.requireDict["player0"]["prior"]["pos"])){
                                console.log(rally[k-1]["tech"], this_.requireDict["player0"]["prior"]["tech"])

                                if(this_.requireDict["player0"]["current"]["filter"] == 1){
                                    if ((rally[k]["tech"] in this_.requireDict["player0"]["current"]["tech"])&&(rally[k]["ballpos"] in this_.requireDict["player0"]["current"]["ballpos"])&&(rally[k]["pos"] in this_.requireDict["player0"]["current"]["pos"])){
                                        let tmp_object = {}
                                        tmp_object["player"] = "player0";
                                        tmp_object["time_context"] = count_stroke;
                                        tmp_object["score_context"] = {};
                                            tmp_object["score_context"]["big_score"] = game_score[i];
                                            tmp_object["score_context"]["sma_score"] = score;
                                        tmp_object["stroke_context"] = {};
                                            tmp_object["stroke_context"]["rally"] = rally;
                                            tmp_object["stroke_context"]["rally_seq"] = k;
                                        this_.infoArray.push(tmp_object);
                                    }
                                }
                                else{
                                    let tmp_object = {}
                                    tmp_object["player"] = "player0";
                                    tmp_object["time_context"] = count_stroke;
                                    tmp_object["score_context"] = {};
                                        tmp_object["score_context"]["big_score"] = game_score[i];
                                        tmp_object["score_context"]["sma_score"] = score;
                                    tmp_object["stroke_context"] = {};
                                        tmp_object["stroke_context"]["rally"] = rally;
                                        tmp_object["stroke_context"]["rally_seq"] = k;
                                    this_.infoArray.push(tmp_object);
                                }
                            }
                            
                        }
                        else if(this_.requireDict["player0"]["next"]["filter"] == 1){
                            if (k == rally.length - 1){
                                continue;
                            }
                            if ((rally[k+1]["tech"] in this_.requireDict["player0"]["next"]["tech"])&&(rally[k+1]["ballpos"] in this_.requireDict["player0"]["next"]["ballpos"])&&(rally[k+1]["pos"] in this_.requireDict["player0"]["next"]["pos"])){
                                if(this_.requireDict["player0"]["current"]["filter"] == 1){
                                    if ((rally[k]["tech"] in this_.requireDict["player0"]["current"]["tech"])&&(rally[k]["ballpos"] in this_.requireDict["player0"]["current"]["ballpos"])&&(rally[k]["pos"] in this_.requireDict["player0"]["current"]["pos"])){
                                        let tmp_object = {}
                                        tmp_object["player"] = "player0";
                                        tmp_object["time_context"] = count_stroke;
                                        tmp_object["score_context"] = {};
                                            tmp_object["score_context"]["big_score"] = game_score[i];
                                            tmp_object["score_context"]["sma_score"] = score;
                                        tmp_object["stroke_context"] = {};
                                            tmp_object["stroke_context"]["rally"] = rally;
                                            tmp_object["stroke_context"]["rally_seq"] = k;
                                        this_.infoArray.push(tmp_object);
                                    }
                                }
                                else{
                                    let tmp_object = {}
                                    tmp_object["player"] = "player0";
                                    tmp_object["time_context"] = count_stroke;
                                    tmp_object["score_context"] = {};
                                        tmp_object["score_context"]["big_score"] = game_score[i];
                                        tmp_object["score_context"]["sma_score"] = score;
                                    tmp_object["stroke_context"] = {};
                                        tmp_object["stroke_context"]["rally"] = rally;
                                        tmp_object["stroke_context"]["rally_seq"] = k;
                                    this_.infoArray.push(tmp_object);
                                }
                            }
                        }
                        else if(this_.requireDict["player0"]["current"]["filter"] == 1){
                            if ((rally[k]["tech"] in this_.requireDict["player0"]["current"]["tech"])&&(rally[k]["ballpos"] in this_.requireDict["player0"]["current"]["ballpos"])&&(rally[k]["pos"] in this_.requireDict["player0"]["current"]["pos"])){
                                let tmp_object = {}
                                tmp_object["player"] = "player0";
                                tmp_object["time_context"] = count_stroke;
                                tmp_object["score_context"] = {};
                                    tmp_object["score_context"]["big_score"] = game_score[i];
                                    tmp_object["score_context"]["sma_score"] = score;
                                tmp_object["stroke_context"] = {};
                                    tmp_object["stroke_context"]["rally"] = rally;
                                    tmp_object["stroke_context"]["rally_seq"] = k;
                                this_.infoArray.push(tmp_object);
                            }
                        }
                        else{
                            let tmp_object = {}
                                tmp_object["player"] = "player0";
                                tmp_object["time_context"] = count_stroke;
                                tmp_object["score_context"] = {};
                                    tmp_object["score_context"]["big_score"] = game_score[i];
                                    tmp_object["score_context"]["sma_score"] = score;
                                tmp_object["stroke_context"] = {};
                                    tmp_object["stroke_context"]["rally"] = rally;
                                    tmp_object["stroke_context"]["rally_seq"] = k;
                                this_.infoArray.push(tmp_object);

                        }
                    }
                }
            }

        }
        else if (this_.requireDict["player1"]["display"] == 1){
            this_.num_player = 1;

            let count_stroke = -1;
            for(let i = 0; i < data.length; i++){
                for(let j = 0; j < data[i].length; j++){
                    for (let k = 0; k < data[i][j]["strokes"].length; k++){
                        let score = data[i][j]["score"];
                        let rally = data[i][j]["strokes"];
                        count_stroke += 1;

                        if(rally[k]["hitplayer"] == 0){
                            continue;
                        }
                        if(this_.requireDict["player1"]["prior"]["filter"] == 1){
                            if (k == 0){
                                continue;
                            }
                            if ((rally[k-1]["tech"] in this_.requireDict["player1"]["prior"]["tech"])&&(rally[k-1]["ballpos"] in this_.requireDict["player1"]["prior"]["ballpos"])&&(rally[k-1]["pos"] in this_.requireDict["player1"]["prior"]["pos"])){
                                if(this_.requireDict["player1"]["current"]["filter"] == 1){
                                    if ((rally[k]["tech"] in this_.requireDict["player1"]["current"]["tech"])&&(rally[k]["ballpos"] in this_.requireDict["player1"]["current"]["ballpos"])&&(rally[k]["pos"] in this_.requireDict["player1"]["current"]["pos"])){
                                        let tmp_object = {}
                                        tmp_object["player"] = "player1";
                                        tmp_object["time_context"] = count_stroke;
                                        tmp_object["score_context"] = {};
                                            tmp_object["score_context"]["big_score"] = game_score[i];
                                            tmp_object["score_context"]["sma_score"] = score;
                                        tmp_object["stroke_context"] = {};
                                            tmp_object["stroke_context"]["rally"] = rally;
                                            tmp_object["stroke_context"]["rally_seq"] = k;
                                        this_.infoArray.push(tmp_object);
                                    }
                                }
                                else{
                                    let tmp_object = {}
                                    tmp_object["player"] = "player1";
                                    tmp_object["time_context"] = count_stroke;
                                    tmp_object["score_context"] = {};
                                        tmp_object["score_context"]["big_score"] = game_score[i];
                                        tmp_object["score_context"]["sma_score"] = score;
                                    tmp_object["stroke_context"] = {};
                                        tmp_object["stroke_context"]["rally"] = rally;
                                        tmp_object["stroke_context"]["rally_seq"] = k;
                                    this_.infoArray.push(tmp_object);
                                }
                            }
                            
                        }
                        else if(this_.requireDict["player1"]["next"]["filter"] == 1){
                            if (k == rally.length - 1){
                                continue;
                            }
                            if ((rally[k+1]["tech"] in this_.requireDict["player1"]["next"]["tech"])&&(rally[k+1]["ballpos"] in this_.requireDict["player1"]["next"]["ballpos"])&&(rally[k+1]["pos"] in this_.requireDict["player1"]["next"]["pos"])){
                                if(this_.requireDict["player1"]["current"]["filter"] == 1){
                                    if ((rally[k]["tech"] in this_.requireDict["player1"]["current"]["tech"])&&(rally[k]["ballpos"] in this_.requireDict["player1"]["current"]["ballpos"])&&(rally[k]["pos"] in this_.requireDict["player1"]["current"]["pos"])){
                                        let tmp_object = {}
                                        tmp_object["player"] = "player1";
                                        tmp_object["time_context"] = count_stroke;
                                        tmp_object["score_context"] = {};
                                            tmp_object["score_context"]["big_score"] = game_score[i];
                                            tmp_object["score_context"]["sma_score"] = score;
                                        tmp_object["stroke_context"] = {};
                                            tmp_object["stroke_context"]["rally"] = rally;
                                            tmp_object["stroke_context"]["rally_seq"] = k;
                                        this_.infoArray.push(tmp_object);
                                    }
                                }
                                else{
                                    let tmp_object = {}
                                    tmp_object["player"] = "player1";
                                    tmp_object["time_context"] = count_stroke;
                                    tmp_object["score_context"] = {};
                                        tmp_object["score_context"]["big_score"] = game_score[i];
                                        tmp_object["score_context"]["sma_score"] = score;
                                    tmp_object["stroke_context"] = {};
                                        tmp_object["stroke_context"]["rally"] = rally;
                                        tmp_object["stroke_context"]["rally_seq"] = k;
                                    this_.infoArray.push(tmp_object);
                                }
                            }
                        }
                        else if(this_.requireDict["player1"]["current"]["filter"] == 1){
                            if ((rally[k]["tech"] in this_.requireDict["player1"]["current"]["tech"])&&(rally[k]["ballpos"] in this_.requireDict["player1"]["current"]["ballpos"])&&(rally[k]["pos"] in this_.requireDict["player1"]["current"]["pos"])){
                                let tmp_object = {}
                                tmp_object["player"] = "player1";
                                tmp_object["time_context"] = count_stroke;
                                tmp_object["score_context"] = {};
                                    tmp_object["score_context"]["big_score"] = game_score[i];
                                    tmp_object["score_context"]["sma_score"] = score;
                                tmp_object["stroke_context"] = {};
                                    tmp_object["stroke_context"]["rally"] = rally;
                                    tmp_object["stroke_context"]["rally_seq"] = k;
                                this_.infoArray.push(tmp_object);
                            }
                        }
                        else{
                            let tmp_object = {}
                                tmp_object["player"] = "player1";
                                tmp_object["time_context"] = count_stroke;
                                tmp_object["score_context"] = {};
                                    tmp_object["score_context"]["big_score"] = game_score[i];
                                    tmp_object["score_context"]["sma_score"] = score;
                                tmp_object["stroke_context"] = {};
                                    tmp_object["stroke_context"]["rally"] = rally;
                                    tmp_object["stroke_context"]["rally_seq"] = k;
                                this_.infoArray.push(tmp_object);

                        }
                    }
                }
            }

        }
        else if (this_.requireDict["player0&player1"]["display"] == 1){
            this_.num_player = 2;

            let count_stroke = -1;
            for(let i = 0; i < data.length; i++){
                for(let j = 0; j < data[i].length; j++){
                    for (let k = 0; k < data[i][j]["strokes"].length; k++){
                        let score = data[i][j]["score"];
                        let rally = data[i][j]["strokes"];
                        count_stroke += 1;

                        if(rally[k]["hitplayer"] == 0){
                            if ((rally[k]["tech"] in this_.requireDict["player0&player1"]["tech0"])&&(rally[k]["ballpos"] in this_.requireDict["player0&player1"]["ballpos0"])&&(rally[k]["pos"] in this_.requireDict["player0&player1"]["pos0"])){
                                    console.log(rally[k]["tech"])
                                    let tmp_object = {}
                                    tmp_object["player"] = "player0";
                                    tmp_object["time_context"] = count_stroke;
                                    tmp_object["score_context"] = {};
                                        tmp_object["score_context"]["big_score"] = game_score[i];
                                        tmp_object["score_context"]["sma_score"] = score;
                                    tmp_object["stroke_context"] = {};
                                        tmp_object["stroke_context"]["rally"] = rally;
                                        tmp_object["stroke_context"]["rally_seq"] = k;
                                    infoArray_0.push(tmp_object);
                            }
                        }
                        else{
                            if ((rally[k]["tech"] in this_.requireDict["player0&player1"]["tech1"])&&(rally[k]["ballpos"] in this_.requireDict["player0&player1"]["ballpos1"])&&(rally[k]["pos"] in this_.requireDict["player0&player1"]["pos1"])){
                                    let tmp_object = {}
                                    tmp_object["player"] = "player1";
                                    tmp_object["time_context"] = count_stroke;
                                    tmp_object["score_context"] = {};
                                        tmp_object["score_context"]["big_score"] = game_score[i];
                                        tmp_object["score_context"]["sma_score"] = score;
                                    tmp_object["stroke_context"] = {};
                                        tmp_object["stroke_context"]["rally"] = rally;
                                        tmp_object["stroke_context"]["rally_seq"] = k;
                                    infoArray_1.push(tmp_object);
                            }
                        }
                    }     
                }
            }
            let length = d3.min([infoArray_0.length, infoArray_1.length]);
            for(let i = 0; i < length; i ++){
                this_.infoArray.push(infoArray_0[i]);
                this_.infoArray.push(infoArray_1[i]);
            }
            if(infoArray_0.length > infoArray_1.length){
                for(let i = length; i < infoArray_0.length; i++){
                    this_.infoArray.push(infoArray_0[i]);
                }
            }
            else if(infoArray_1.length > infoArray_0.length){
                for(let i = length; i < infoArray_1.length; i++){
                    this_.infoArray.push(infoArray_1[i]);
                } 
            }
            this_.shorter_length = length;

        }
    }
    paint_score(){
        let this_ = this,
            top_gap = this_.top_gap,
            side_gap = 5,
            score_back_gap_height = this_.sma_gap_height,
            score_front_gap_height  =  score_back_gap_height,
            score_side_gap = 5,

            score_back_width = parseInt(this_.svg_score.style("width").split("p")[0]) - side_gap*2,
            score_width = (score_back_width - score_side_gap*2)/3,

            score_back_height = this_.rect_height,
            big_score_height = score_back_height - score_front_gap_height*2,
            sma_score_height = big_score_height * 0.6,
            win_gap = 5;
            

        let g = this_.svg_score_g.selectAll("g")
        .data(this.infoArray)
        .enter().append("g")
        .attr("id", function(d,i){return "_" + i;});

        g.append("rect")//back
        .attr("id", "back_rect")
        .attr("class", "score back_rect normal")
        .attr("x", side_gap)
        .attr("y", function(d,i){
            return i*(score_back_height + score_back_gap_height) + top_gap; 
        })
        .attr("width", score_back_width)
        .attr("height", score_back_height);

        g.append("rect")//front_left
        .attr("id", "front_rect")
        .attr("class", "score front_rect")
        .attr("x", side_gap + score_side_gap)
        .attr("y", function(d,i){
            return i*(score_back_height + score_back_gap_height) + top_gap + score_front_gap_height; 
        })
        .attr("width", score_width)
        .attr("height", big_score_height);
        g.append("rect")//front_mid
        .attr("id", "front_rect")
        .attr("class", "score front_rect")
        .attr("x", side_gap + score_side_gap + score_width)
        .attr("y", function(d,i){
            return i*(score_back_height + score_back_gap_height) + top_gap + score_front_gap_height; 
        })
        .attr("width", score_width)
        .attr("height", sma_score_height);

        g.append("rect")//front_mid_bot
        .attr("id", "front_rect")
        .attr("class", function(d,i){
            let rally = d["stroke_context"]["rally"],
                last_stroke = rally[rally.length-1],
                win = last_stroke["win"],
                player = last_stroke["hitplayer"];
            if((win == 1)&&(player == 0)||(win == 0)&&(player == 1)){
                return "score front_rect player0";
            }
            else{
                return "score front_rect player1";
            }
        })
        .attr("x", side_gap + score_side_gap + score_width + win_gap)
        .attr("y", function(d,i){
            return i*(score_back_height + score_back_gap_height) + top_gap + score_front_gap_height + sma_score_height + win_gap; 
        })
        .attr("width", score_width - win_gap*2)
        .attr("height", sma_score_height - win_gap*3);
        
        g.append("rect")//front_right
        .attr("id", "front_rect")
        .attr("class", "score front_rect")
        .attr("x", side_gap + score_side_gap + score_width*2)
        .attr("y", function(d,i){
            return i*(score_back_height + score_back_gap_height) + top_gap + score_front_gap_height; 
        })
        .attr("width", score_width)
        .attr("height", big_score_height);

        g.append("text")//left_text
        .attr("id", "front_text")
        .attr("class", "score front_text player0")
        .attr("dx", side_gap + score_side_gap + score_width/2)
        .attr("dy", function(d,i){
            return i*(score_back_height + score_back_gap_height) + top_gap + score_front_gap_height + big_score_height/2; 
        })
        .attr("font-size", big_score_height*0.7)
        .text(function(d,i){
            return d["score_context"]["sma_score"][0] + "";
        })
        g.append("text")//mid_left_text
        .attr("id", "front_text")
        .attr("class", "score front_text player0")
        .attr("dx", side_gap + score_side_gap + score_width + score_width/4)
        .attr("dy", function(d,i){
            return i*(score_back_height + score_back_gap_height) + top_gap + score_front_gap_height + big_score_height/4; 
        })
        .attr("font-size", sma_score_height*0.8)
        .text(function(d,i){
            return d["score_context"]["big_score"][0] + "";
        })
        g.append("text")//mid_right_text
        .attr("id", "front_text")
        .attr("class", "score front_text player1")
        .attr("dx", side_gap + score_side_gap + score_width + 3*score_width/4)
        .attr("dy", function(d,i){
            return i*(score_back_height + score_back_gap_height) + top_gap + score_front_gap_height + big_score_height/4; 
        })
        .attr("font-size", sma_score_height*0.8)
        .text(function(d,i){
            return d["score_context"]["big_score"][1] + "";
        })
        g.append("text")//right_text
        .attr("id", "front_text")
        .attr("class", "score front_text player1")
        .attr("dx", side_gap + score_side_gap + score_width*2 + score_width/2)
        .attr("dy", function(d,i){
            return i*(score_back_height + score_back_gap_height) + top_gap + score_front_gap_height + big_score_height/2; 
        })
        .attr("font-size", big_score_height*0.7)
        .text(function(d,i){
            return d["score_context"]["sma_score"][1] + "";
        })
    }
    paint_tree(){
    	let this_ = this;
        let tech_list = ["1","2","3","4","5","6","7","8","9"],
            ballpos_list = ["0","1","2","3","4","5","6","7","8"],
            pos_list = ["1","2","3","4"];
            


        let y0 = this_.tree_seq*(this_.rect_height + this_.sma_gap_height) + this_.top_gap - (this_.extend_dis - this_.extend_height_gap),
            x0,
            width = this_.sma_rect_width*3 + this_.sma_gap_width*2 + this_.extend_width_more*2,
            height = (this_.extend_dis - this_.extend_height_gap)*2 + this_.rect_height,
            side_gap = width/10,
            mid_gap = width*3/16,
            column_width = width/8,
            top_gap = 5,
            tech_height = (height - top_gap*2)/(tech_list.length),
            ballpos_height = (height - top_gap*2)/(ballpos_list.length),
            pos_height = (height - top_gap*2)/(pos_list.length);

        if (this_.tree_seq == 0){
            y0 = this_.tree_seq*(this_.rect_height + this_.sma_gap_height) + this_.top_gap - (this_.extend_dis - this_.extend_height_gap) + this_.extend_dis;
        }
        else if (this_.tree_seq == this_.infoArray.length-1){
            y0 = this_.tree_seq*(this_.rect_height + this_.sma_gap_height) + this_.top_gap - (this_.extend_dis - this_.extend_height_gap) - this_.extend_dis;
        }
        else{
            y0 = this_.tree_seq*(this_.rect_height + this_.sma_gap_height) + this_.top_gap - (this_.extend_dis - this_.extend_height_gap);
        }

        let color_array = ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252"];
        
        let g_add = this_.svg_main_g.append("g").attr("id", "add_rect");
        let g_rect1 = g_add.append("g").attr("id", "add_rect");
        let g_line = g_add.append("g").attr("id", "add_line");
        let g_rect = g_add.append("g").attr("id", "add_rect");

		function tree(WinRate_name){
            let tech_name = ["loop", "smash", "flick", "chop long", "drop shot", "block", "cut", "parrel", "lob"],
                ballpos_name = ["short backhand", "short middle", "short forehand", "half_long backhand", "half_long middle", "half_long forehand", "long backhand", "long middle", "long forehand"],
                pos_name = ["anti-sideways", "forehand", "backhand", "sideways"];
			let WinRate_line,
				WinRate_rect;
            let exist,
                fill_scale_LL,
                fill_scale_L,
                fill_scale_R,
                fill_scale_RR;

                let stroke = this_.infoArray[this_.tree_seq],
                    rally_seq = stroke["stroke_context"]["rally_seq"],
                    rally = stroke["stroke_context"]["rally"];

            //calculate the scale for LL, L, R, RR
            if (WinRate_name == "LLWinRate"){
                let max = -1,
                    min = 1,
                    ballpos,
                    keys;
                if (rally_seq - 2 < 0){
                    exist = "hidden";
                }
                else{
                    exist = "visible";
                    ballpos = rally[rally_seq - 1]["ballpos"];

                    keys = Object.keys(rally[rally_seq-1]["available"]["tech"]);
                    keys.forEach((key, index)=>{
                        if ((key != -1)&&(key != 0)&&(key != 10)){
                            let tmp= rally[rally_seq-1]["winning_rate"]["tech"][key];
                            if (max < tmp){
                                max = tmp;
                            }
                            if (min > tmp){
                                min = tmp;
                            }
                        }
                    })
                    if(ballpos != -1){
                        keys = Object.keys(rally[rally_seq-1]["available"]["ballpos"]);
                        keys.forEach((key, index)=>{
                            if ((key != -1)&&(key != 9)){
                                let tmp= rally[rally_seq-1]["winning_rate"]["ballpos"][key];
                                if (max < tmp){
                                    max = tmp;
                                }
                                if (min > tmp){
                                    min = tmp;
                                }
                            }
                        })
                    }
                    keys = Object.keys(rally[rally_seq-1]["available"]["pos"]);
                    keys.forEach((key, index)=>{
                        if ((key != -1)&&(key != 0)){
                            let tmp= rally[rally_seq-1]["winning_rate"]["pos"][key];
                            if (max < tmp){
                                max = tmp;
                            }
                            if (min > tmp){
                                min = tmp;
                            }
                        }
                    })
                    let tmp_value = (max - min)/color_array.length,
                        tmp_array = [];
                    for(let i = 0; i < color_array.length; i++){
                        tmp_array.push(min + tmp_value * i);
                    }
                    fill_scale_LL = d3.scaleThreshold().domain(tmp_array)
                    .range(color_array);
                } 

            }
            else if (WinRate_name == "LWinRate"){
                let max = -1,
                    min = 1,
                    ballpos,
                    keys;
                if (rally_seq - 1 < 0){
                    exist = "hidden";
                }
                else{
                    exist = "visible";
                    ballpos = rally[rally_seq]["ballpos"];

                    keys = Object.keys(rally[rally_seq]["available"]["tech"]);
                    keys.forEach((key, index)=>{
                        if ((key != -1)&&(key != 0)){
                            let tmp= rally[rally_seq]["winning_rate"]["tech"][key];
                            if (max < tmp){
                                max = tmp;
                            }
                            if (min > tmp){
                                min = tmp;
                            }
                        }
                    })
                    if(ballpos != -1){
                        keys = Object.keys(rally[rally_seq]["available"]["ballpos"]);
                        keys.forEach((key, index)=>{
                            if ((key != -1)&&(key != 0)&&(key != 10)){
                                let tmp= rally[rally_seq]["winning_rate"]["ballpos"][key];
                                if (max < tmp){
                                    max = tmp;
                                }
                                if (min > tmp){
                                    min = tmp;
                                }
                            }
                        })
                    }
                    keys = Object.keys(rally[rally_seq]["available"]["pos"]);
                    keys.forEach((key, index)=>{
                        if ((key != -1)&&(key != 9)){
                            let tmp= rally[rally_seq]["winning_rate"]["pos"][key];
                            if (max < tmp){
                                max = tmp;
                            }
                            if (min > tmp){
                                min = tmp;
                            }
                        }
                    })
                    let tmp_value = (max - min)/color_array.length,
                        tmp_array = [];
                    for(let i = 0; i < color_array.length; i++){
                        tmp_array.push(min + tmp_value * i);
                    }
                    fill_scale_L = d3.scaleThreshold().domain(tmp_array)
                    .range(color_array);
                }
                    
            }
            else if (WinRate_name == "RWinRate"){
                let max = -1,
                    min = 1,
                    ballpos,
                    keys;
                if (rally_seq + 1 >=  rally.length){
                    exist = "hidden";
                }
                else{
                    exist = "visible";
                    ballpos = rally[rally_seq + 1]["ballpos"];

                    keys = Object.keys(rally[rally_seq+1]["available"]["tech"]);
                    keys.forEach((key, index)=>{
                        if ((key != -1)&&(key != 0)&&(key != 10)){
                            let tmp= rally[rally_seq+1]["winning_rate"]["tech"][key];
                            if (max < tmp){
                                max = tmp;
                            }
                            if (min > tmp){
                                min = tmp;
                            }
                        }
                    })
                    if(ballpos != -1){
                        keys = Object.keys(rally[rally_seq+1]["available"]["ballpos"]);
                        keys.forEach((key, index)=>{
                            if ((key != -1)&&(key != 9)){
                                let tmp= rally[rally_seq+1]["winning_rate"]["ballpos"][key];
                                if (max < tmp){
                                    max = tmp;
                                }
                                if (min > tmp){
                                    min = tmp;
                                }
                            }
                        })
                    }
                    keys = Object.keys(rally[rally_seq+1]["available"]["pos"]);
                    keys.forEach((key, index)=>{
                        if ((key != -1)&&(key != 0)){
                            let tmp= rally[rally_seq+1]["winning_rate"]["pos"][key];
                            if (max < tmp){
                                max = tmp;
                            }
                            if (min > tmp){
                                min = tmp;
                            }
                        }
                    })
                    let tmp_value = (max - min)/color_array.length,
                        tmp_array = [];
                    for(let i = 0; i < color_array.length; i++){
                        tmp_array.push(min + tmp_value * i);
                    }
                    fill_scale_R = d3.scaleThreshold().domain(tmp_array)
                    .range(color_array);
                }
                    
            }
            else if (WinRate_name == "RRWinRate"){
                let max = -1,
                    min = 1,
                    ballpos,
                    keys;
                if (rally_seq + 2 >=  rally.length){
                    exist = "hidden";
                }
                else{
                    exist = "visible";
                    ballpos = rally[rally_seq + 2]["ballpos"];

                    keys = Object.keys(rally[rally_seq+2]["available"]["tech"]);
                    keys.forEach((key, index)=>{
                        if ((key != -1)&&(key != 0)&&(key != 10)){
                            let tmp= rally[rally_seq+2]["winning_rate"]["tech"][key];
                            if (max < tmp){
                                max = tmp;
                            }
                            if (min > tmp){
                                min = tmp;
                            }
                        }
                    })
                    if(ballpos != -1){
                        keys = Object.keys(rally[rally_seq+2]["available"]["ballpos"]);
                        keys.forEach((key, index)=>{
                            if ((key != -1)&&(key != 9)){
                                let tmp= rally[rally_seq+2]["winning_rate"]["ballpos"][key];
                                if (max < tmp){
                                    max = tmp;
                                }
                                if (min > tmp){
                                    min = tmp;
                                }
                            }
                        })
                    }
                    keys = Object.keys(rally[rally_seq+2]["available"]["pos"]);
                    keys.forEach((key, index)=>{
                        if ((key != -1)&&(key != 0)){
                            let tmp= rally[rally_seq+2]["winning_rate"]["pos"][key];
                            if (max < tmp){
                                max = tmp;
                            }
                            if (min > tmp){
                                min = tmp;
                            }
                        }
                    })
                    let tmp_value = (max - min)/color_array.length,
                        tmp_array = [];
                    for(let i = 0; i < color_array.length; i++){
                        tmp_array.push(min + tmp_value * i);
                    }
                    fill_scale_RR = d3.scaleThreshold().domain(tmp_array)
                    .range(color_array);
                }
                   
            }
            //calculate the x0 for LL, L, R, RR 
            if (WinRate_name == "LLWinRate"){
                x0 = this_.LLWinRate_x0 - this_.extend_width_more;
            }
            else if (WinRate_name == "LWinRate"){
                x0 = this_.LWinRate_x0 - this_.extend_width_more;
            }
            else if (WinRate_name == "RWinRate"){
                x0 = this_.RWinRate_x0 - this_.extend_width_more;
            }
            else if (WinRate_name == "RRWinRate"){
                x0 = this_.RRWinRate_x0 - this_.extend_width_more;
            }
            
            //assign g for LL, L, R, RR 
            if (WinRate_name == "LLWinRate"){ 
                WinRate_line = g_line.append("g").attr("id", "LLWinRate");
                WinRate_rect = g_rect.append("g").attr("id", "LLWinRate");
            }
            else if (WinRate_name == "LWinRate"){
                WinRate_line = g_line.append("g").attr("id", "LWinRate");
                WinRate_rect = g_rect.append("g").attr("id", "LWinRate");
            }
            else if (WinRate_name == "RWinRate"){
                WinRate_line = g_line.append("g").attr("id", "RWinRate");
                WinRate_rect = g_rect.append("g").attr("id", "RWinRate");
            }
            else if (WinRate_name == "RRWinRate"){
                WinRate_line = g_line.append("g").attr("id", "RRWinRate");
                WinRate_rect = g_rect.append("g").attr("id", "RRWinRate");
            }
            //background rect
            g_rect1.append("rect")
            .attr("class", "add back_rect")
            .attr("x", x0)
            .attr("y", y0)
            .attr("width", width)
            .attr("height", height)
            .attr("visibility", exist)
            //front rect
            tech_list.forEach((tech, index) => {
                WinRate_rect.append("rect")
                .attr("id", `rect_${index}`)
                .attr("class", "add front_rect")
                .attr("x", x0 + side_gap)
                .attr("y", y0 + top_gap + index*tech_height)
                .attr("width", column_width)
                .attr("height", tech_height)
                .attr("fill", function(d,i){
                    if (WinRate_name == "LLWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq-1]["winning_rate"];
                            return fill_scale_LL(winning_rate["tech"][tech]); 
                        }
                        return "";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq]["winning_rate"];
                            return fill_scale_L(winning_rate["tech"][tech]);
                        }
                        return "";   
                    }
                    else if (WinRate_name == "RWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq+1]["winning_rate"];
                            return fill_scale_R(winning_rate["tech"][tech]); 
                        }
                        return "";
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq+2]["winning_rate"];
                            return fill_scale_RR(winning_rate["tech"][tech]); 
                        }
                        return "";  
                    }
                })
                .attr("visibility", function(d,i){
                    if (WinRate_name == "LLWinRate"){
                        if(exist == "visible"){
                            let available = rally[rally_seq-1]["available"];
                            let stroke = rally[rally_seq-1]
                            if((tech in available["tech"])||(stroke["tech"] == parseInt(tech))){
                                return "visible";
                            }
                            else{
                                return "hidden";
                            }
                        }
                        return "hidden";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if(exist == "visible"){
                            let available = rally[rally_seq]["available"];
                            let stroke = rally[rally_seq]
                            if((tech in available["tech"])||(stroke["tech"] == parseInt(tech))){
                                return "visible";
                            }
                            else{
                                return "hidden";
                            }
                        }
                        return "hidden";   
                    }
                    else if (WinRate_name == "RWinRate"){
                        if(exist == "visible"){
                            let available = rally[rally_seq+1]["available"];
                            let stroke = rally[rally_seq+1]
                            if((tech in available["tech"])||(stroke["tech"] == parseInt(tech))){
                                return "visible";
                            }
                            else{
                                return "hidden";
                            }
                        }
                        return "hidden";
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if(exist == "visible"){
                            let available = rally[rally_seq+2]["available"];
                            let stroke = rally[rally_seq+2]
                            if((tech in available["tech"])||(stroke["tech"] == parseInt(tech))){
                                return "visible";
                            }
                            else{
                                return "hidden";
                            }
                        }
                        return "hidden";
                    }
                })
                .on("mouseover", function(d,i){
                    let tmp = "#detail_tech" + d3.select(this).attr("id").split("_")[1];
                    WinRate_rect.selectAll(tmp).attr("visibility", "visible");
                })
                .on("mouseout", function(d,i){
                    let tmp = "#detail_tech" + d3.select(this).attr("id").split("_")[1];

                    WinRate_rect.selectAll(tmp).attr("visibility", "hidden");
                })
            })

            ballpos_list.forEach((ballpos, index) => {
                WinRate_rect.append("rect")
                .attr("id", `rect_${index}`)
                .attr("class", "add front_rect")
                .attr("x", x0 + side_gap + column_width + mid_gap)
                .attr("y", y0 + top_gap + index*ballpos_height)
                .attr("width", column_width)
                .attr("height", ballpos_height)
                .attr("fill", function(d,i){
                    if (WinRate_name == "LLWinRate"){
                        if(exist == "visible"){
                            let ballpos_ = rally[rally_seq-1]["ballpos"];
                            if(ballpos_ != -1){
                                let winning_rate = rally[rally_seq-1]["winning_rate"];
                                return fill_scale_LL(winning_rate["ballpos"][ballpos]); 
                            }    
                        }
                        return "";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if(exist == "visible"){
                            let ballpos_ = rally[rally_seq]["ballpos"];
                            if(ballpos_ != -1){
                                let winning_rate = rally[rally_seq]["winning_rate"];
                                return fill_scale_L(winning_rate["ballpos"][ballpos]); 
                            }
                        }
                        return "";   
                    }
                    else if (WinRate_name == "RWinRate"){
                        if(exist == "visible"){
                            let ballpos_ = rally[rally_seq+1]["ballpos"];
                            if(ballpos_ != -1){
                                let winning_rate = rally[rally_seq+1]["winning_rate"];
                                return fill_scale_R(winning_rate["ballpos"][ballpos]); 
                            } 
                        }
                        return "";
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if(exist == "visible"){
                            let ballpos_ = rally[rally_seq+2]["ballpos"];
                            if(ballpos_ != -1){
                                let winning_rate = rally[rally_seq+2]["winning_rate"];
                                return fill_scale_RR(winning_rate["ballpos"][ballpos]); 
                            } 
                        }
                        return "";  
                    }
                })
                .attr("visibility", function(d,i){
                    if (WinRate_name == "LLWinRate"){
                        if(exist == "visible"){
                            let ballpos_ = rally[rally_seq-1]["ballpos"];
                            if(ballpos_ != -1){
                                let available = rally[rally_seq-1]["available"];
                                if((ballpos in available["ballpos"])||(ballpos_ == parseInt(ballpos))){
                                    return "visible" 
                                }
                                else{
                                    return "hidden"
                                }
                            }    
                        }
                        return "hidden";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if(exist == "visible"){
                            let ballpos_ = rally[rally_seq]["ballpos"];
                            if(ballpos_ != -1){
                                let available = rally[rally_seq]["available"];
                                if((ballpos in available["ballpos"])||(ballpos_ == parseInt(ballpos))){
                                    return "visible" 
                                }
                                else{
                                    return "hidden"
                                } 
                            }
                        }
                        return "hidden";   
                    }
                    else if (WinRate_name == "RWinRate"){
                        if(exist == "visible"){
                            let ballpos_ = rally[rally_seq+1]["ballpos"];
                            if(ballpos_ != -1){
                                let available = rally[rally_seq+1]["available"];
                                if((ballpos in available["ballpos"])||(ballpos_ == parseInt(ballpos))){
                                    return "visible" 
                                }
                                else{
                                    return "hidden"
                                } 
                            } 
                        }
                        return "hidden";
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if(exist == "visible"){
                            let ballpos_ = rally[rally_seq+2]["ballpos"];
                            if(ballpos_ != -1){
                                let available = rally[rally_seq+2]["available"];
                                if((ballpos in available["ballpos"])||(ballpos_ == parseInt(ballpos))){
                                    return "visible" 
                                }
                                else{
                                    return "hidden"
                                }
                            } 
                        }
                        return "hidden";  
                    }
                })
                .on("mouseover", function(d,i){
                    let tmp = "#detail_ballpos" + d3.select(this).attr("id").split("_")[1];
                    WinRate_rect.selectAll(tmp).attr("visibility", "visible");
                })
                .on("mouseout", function(d,i){
                    let tmp = "#detail_ballpos" + d3.select(this).attr("id").split("_")[1];

                    WinRate_rect.selectAll(tmp).attr("visibility", "hidden");
                })
            })

            pos_list.forEach((pos, index) => {
                WinRate_rect.append("rect")
                .attr("id", `rect_${index}`)
                .attr("class", "add front_rect")
                .attr("x", x0 + side_gap + (column_width + mid_gap)*2)
                .attr("y", y0 + top_gap + index*pos_height)
                .attr("width", column_width)
                .attr("height", pos_height)
                .attr("fill", function(d,i){
                    if (WinRate_name == "LLWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq-1]["winning_rate"];
                            return fill_scale_LL(winning_rate["pos"][pos]); 
                        }
                        return "";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if(exist == "visible"){
                            
                            let winning_rate = rally[rally_seq]["winning_rate"];
                            if (pos == "1"){
                                console.log("here", winning_rate["pos"][pos], fill_scale_L(winning_rate["pos"][pos]));
                            }
                            return fill_scale_L(winning_rate["pos"][pos]);
                        }
                        return "";   
                    }
                    else if (WinRate_name == "RWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq+1]["winning_rate"];
                            return fill_scale_R(winning_rate["pos"][pos]); 
                        }
                        return "";
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq+2]["winning_rate"];
                            return fill_scale_RR(winning_rate["pos"][pos]); 
                        }
                        return "";  
                    }
                })
                .attr("visibility", function(d,i){
                    if (WinRate_name == "LLWinRate"){
                        if(exist == "visible"){
                            let available = rally[rally_seq-1]["available"];
                            let stroke = rally[rally_seq-1]
                            if((pos in available["pos"])||(stroke["pos"] == parseInt(pos))){
                                return "visible";
                            }
                            else{
                                return "hidden";
                            }
                        }
                        return "hidden";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if(exist == "visible"){
                            let available = rally[rally_seq]["available"];
                            let stroke = rally[rally_seq]
                            if((pos in available["pos"])||(stroke["pos"] == parseInt(pos))){
                                return "visible";
                            }
                            else{
                                return "hidden";
                            }
                        }
                        return "hidden";   
                    }
                    else if (WinRate_name == "RWinRate"){
                        if(exist == "visible"){
                            let available = rally[rally_seq+1]["available"];
                            let stroke = rally[rally_seq+1]
                            if((pos in available["pos"])||(stroke["pos"] == parseInt(pos))){
                                return "visible";
                            }
                            else{
                                return "hidden";
                            }
                        }
                        return "hidden";
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if(exist == "visible"){
                            let available = rally[rally_seq+2]["available"];
                            let stroke = rally[rally_seq+2]
                            if((pos in available["pos"])||(stroke["pos"] == parseInt(pos))){
                                return "visible";
                            }
                            else{
                                return "hidden";
                            }
                        }
                        return "hidden";
                    }
                })
                .on("mouseover", function(d,i){

                    let tmp = "#detail_pos" + d3.select(this).attr("id").split("_")[1];
                    console.log(tmp)
                    WinRate_rect.selectAll(tmp).attr("visibility", "visible");
                })
                .on("mouseout", function(d,i){
                    let tmp = "#detail_pos" + d3.select(this).attr("id").split("_")[1];

                    WinRate_rect.selectAll(tmp).attr("visibility", "hidden");
                })
            })
            //front line
            WinRate_line.append("path")
            .attr("class", function(d,i){
                if (WinRate_name == "LLWinRate"){
                    if(exist == "visible"){
                        return `score front_line player${rally[rally_seq-1]["hitplayer"]}`
                    }
                    
                }
                else if (WinRate_name == "LWinRate"){
                    if(exist == "visible"){
                        return `score front_line player${rally[rally_seq]["hitplayer"]}`
                    }
                    
                }
                else if (WinRate_name == "RWinRate"){
                    if(exist == "visible"){
                        return `score front_line player${rally[rally_seq+1]["hitplayer"]}`
                    }
                    
                }
                else if (WinRate_name == "RRWinRate"){
                    if(exist == "visible"){
                        return `score front_line player${rally[rally_seq+2]["hitplayer"]}`
                    }
                    
                }
            })
            .attr("d", function(d,i){
                if (WinRate_name == "LLWinRate"){
                    if(exist == "visible"){
                        let stroke = rally[rally_seq-1]
                        let tech = stroke["tech"],
                            ballpos = stroke["ballpos"],
                            pos = stroke["pos"];

                        let x_0 = x0,
                            y_0 = y0 + height/2,
                            
                            x_1 = x0 + side_gap,
                            tech_index = tech_list.indexOf(""+tech),
                            y_1 = y0 + top_gap + tech_index*tech_height + tech_height/2,
                            
                            x_2 = x0 + side_gap + column_width + mid_gap,
                            ballpos_index = ballpos_list.indexOf(""+ballpos),
                            y_2 = y0 + top_gap + ballpos_index*ballpos_height + tech_height/2,

                            x_3 = x0 + side_gap + (column_width + mid_gap)*2,
                            pos_index = pos_list.indexOf(""+pos),
                            y_3 = y0 + top_gap + pos_index*pos_height + tech_height/2,

                            x_4 = x0 + width,
                            y_4 = y0 + height/2;
                        if(ballpos_index != -1){
                            if(tech_index != -1){
                                if(pos_index != -1){
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_1+column_width} ${y_1} L ${x_2} ${y_2} M ${x_2+column_width} ${y_2} L ${x_3} ${y_3} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_1+column_width} ${y_1} L ${x_2} ${y_2} `;
                                }
                            }
                            else{
                                if(pos_index != -1){
                                    return `M ${x_2+column_width} ${y_2} L ${x_3} ${y_3} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return "";
                                }
                            }
                        }
                        else{
                            if(tech_index != -1){
                                if(pos_index != -1){
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} `;
                                }
                            }
                            else{
                                if(pos_index != -1){
                                    return `M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return "";
                                }
                            }
                        }

                    }
                    return "";
                    
                }
                else if (WinRate_name == "LWinRate"){
                    if(exist == "visible"){
                        let stroke = rally[rally_seq]
                        let tech = stroke["tech"],
                            ballpos = stroke["ballpos"],
                            pos = stroke["pos"];

                        let x_0 = x0,
                            y_0 = y0 + height/2,
                            
                            x_1 = x0 + side_gap,
                            tech_index = tech_list.indexOf(""+tech),
                            y_1 = y0 + top_gap + tech_index*tech_height + tech_height/2,
                            
                            x_2 = x0 + side_gap + column_width + mid_gap,
                            ballpos_index = ballpos_list.indexOf(""+ballpos),
                            y_2 = y0 + top_gap + ballpos_index*ballpos_height + tech_height/2,

                            x_3 = x0 + side_gap + (column_width + mid_gap)*2,
                            pos_index = pos_list.indexOf(""+pos),
                            y_3 = y0 + top_gap + pos_index*pos_height + tech_height/2,

                            x_4 = x0 + width,
                            y_4 = y0 + height/2;
                        if(ballpos_index != -1){
                            if(tech_index != -1){
                                if(pos_index != -1){
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_1+column_width} ${y_1} L ${x_2} ${y_2} M ${x_2+column_width} ${y_2} L ${x_3} ${y_3} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_1+column_width} ${y_1} L ${x_2} ${y_2} `;
                                }
                            }
                            else{
                                if(pos_index != -1){
                                    return `M ${x_2+column_width} ${y_2} L ${x_3} ${y_3} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return "";
                                }
                            }
                        }
                        else{
                            if(tech_index != -1){
                                if(pos_index != -1){
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} `;
                                }
                            }
                            else{
                                if(pos_index != -1){
                                    return `M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return "";
                                }
                            }
                        }
                    } 
                    return "";
                }
                else if (WinRate_name == "RWinRate"){
                    if(exist == "visible"){
                        let stroke = rally[rally_seq+1]
                        let tech = stroke["tech"],
                            ballpos = stroke["ballpos"],
                            pos = stroke["pos"];

                        let x_0 = x0,
                            y_0 = y0 + height/2,
                            
                            x_1 = x0 + side_gap,
                            tech_index = tech_list.indexOf(""+tech),
                            y_1 = y0 + top_gap + tech_index*tech_height + tech_height/2,
                            
                            x_2 = x0 + side_gap + column_width + mid_gap,
                            ballpos_index = ballpos_list.indexOf(""+ballpos),
                            y_2 = y0 + top_gap + ballpos_index*ballpos_height + tech_height/2,

                            x_3 = x0 + side_gap + (column_width + mid_gap)*2,
                            pos_index = pos_list.indexOf(""+pos),
                            y_3 = y0 + top_gap + pos_index*pos_height + tech_height/2,

                            x_4 = x0 + width,
                            y_4 = y0 + height/2;
                        if(ballpos_index != -1){
                            if(tech_index != -1){
                                if(pos_index != -1){
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_1+column_width} ${y_1} L ${x_2} ${y_2} M ${x_2+column_width} ${y_2} L ${x_3} ${y_3} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_1+column_width} ${y_1} L ${x_2} ${y_2} `;
                                }
                            }
                            else{
                                if(pos_index != -1){
                                    return `M ${x_2+column_width} ${y_2} L ${x_3} ${y_3} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return "";
                                }
                            }
                        }
                        else{
                            if(tech_index != -1){
                                if(pos_index != -1){
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} `;
                                }
                            }
                            else{
                                if(pos_index != -1){
                                    return `M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return "";
                                }
                            }
                        }
                    } 
                    return "";
                }
                else if (WinRate_name == "RRWinRate"){
                    if(exist == "visible"){
                        let stroke = rally[rally_seq+2]
                        let tech = stroke["tech"],
                            ballpos = stroke["ballpos"],
                            pos = stroke["pos"];

                        let x_0 = x0,
                            y_0 = y0 + height/2,
                            
                            x_1 = x0 + side_gap,
                            tech_index = tech_list.indexOf(""+tech),
                            y_1 = y0 + top_gap + tech_index*tech_height + tech_height/2,
                            
                            x_2 = x0 + side_gap + column_width + mid_gap,
                            ballpos_index = ballpos_list.indexOf(""+ballpos),
                            y_2 = y0 + top_gap + ballpos_index*ballpos_height + tech_height/2,

                            x_3 = x0 + side_gap + (column_width + mid_gap)*2,
                            pos_index = pos_list.indexOf(""+pos),
                            y_3 = y0 + top_gap + pos_index*pos_height + tech_height/2,

                            x_4 = x0 + width,
                            y_4 = y0 + height/2;
                        if(ballpos_index != -1){
                            if(tech_index != -1){
                                if(pos_index != -1){
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_1+column_width} ${y_1} L ${x_2} ${y_2} M ${x_2+column_width} ${y_2} L ${x_3} ${y_3} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_1+column_width} ${y_1} L ${x_2} ${y_2} `;
                                }
                            }
                            else{
                                if(pos_index != -1){
                                    return `M ${x_2+column_width} ${y_2} L ${x_3} ${y_3} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return "";
                                }
                            }
                        }
                        else{
                            if(tech_index != -1){
                                if(pos_index != -1){
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} `;
                                }
                            }
                            else{
                                if(pos_index != -1){
                                    return `M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return "";
                                }
                            }
                        }
                    } 
                    return "";
                }
            })
            .attr("visibility", exist) 


            tech_list.forEach((tech, index) => {
                WinRate_rect.append("rect")
                .attr("id", `detail_tech${index}`)
                .attr("class", "add front_rect normal")
                .attr("x", x0 + side_gap + column_width*1.5)
                .attr("y", y0 + top_gap + index*tech_height - tech_height)
                .attr("width", column_width*7)
                .attr("height", tech_height*3)
                .attr("visibility", "hidden");   
            });
            tech_list.forEach((tech, index) => {
                WinRate_rect.append("text")
                .attr("id", `detail_tech${index}`)
                .attr("class", "add front_text normal")
                .attr("x", x0 + side_gap + column_width*5)
                .attr("y", y0 + top_gap + index*tech_height + tech_height/2)
                .attr("font-size", tech_height)
                .text( function(d,i){
                    if (WinRate_name == "LLWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq-1]["winning_rate"];
                            return tech_name[index] + " " + winning_rate["tech"][tech].toExponential(2);
                        }
                        return "";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq]["winning_rate"];
                            return tech_name[index] + " " + winning_rate["tech"][tech].toExponential(2);
                        }
                        return "";   
                    }
                    else if (WinRate_name == "RWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq+1]["winning_rate"];
                            return tech_name[index] + " " + winning_rate["tech"][tech].toExponential(2); 
                        }
                        return "";
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq+2]["winning_rate"];
                            return tech_name[index] + " " + winning_rate["tech"][tech].toExponential(2); 
                        }
                        return "";  
                    }
                })
                .attr("visibility", "hidden");   
            });

            ballpos_list.forEach((ballpos, index) => {
                WinRate_rect.append("rect")
                .attr("id", `detail_ballpos${index}`)
                .attr("class", "add front_rect normal")
                .attr("x", x0 + side_gap + column_width + mid_gap+ column_width*1.5)
                .attr("y", y0 + top_gap + index*ballpos_height- ballpos_height)
                .attr("width", column_width*11)
                .attr("height", ballpos_height*3)
                .attr("visibility", "hidden");
                  
            });
            ballpos_list.forEach((ballpos, index) => {
                WinRate_rect.append("text")
                .attr("id", `detail_ballpos${index}`)
                .attr("class", "add front_text normal")
                .attr("x", x0 + side_gap + column_width + mid_gap+ column_width*7)
                .attr("y", y0 + top_gap + index*ballpos_height+ ballpos_height/2)
                .attr("font-size", tech_height)
                .text(function(d,i){
                    if (WinRate_name == "LLWinRate"){
                        if(exist == "visible"){
                            let ballpos = rally[rally_seq-1]["ballpos"];
                            if(ballpos != -1){
                                let winning_rate = rally[rally_seq-1]["winning_rate"];
                                return ballpos_name[index] + " " + winning_rate["ballpos"][ballpos].toExponential(2); 
                            }    
                        }
                        return "";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if(exist == "visible"){
                            let ballpos = rally[rally_seq]["ballpos"];
                            if(ballpos != -1){
                                let winning_rate = rally[rally_seq]["winning_rate"];
                                return ballpos_name[index] + " " + winning_rate["ballpos"][ballpos].toExponential(2); 
                            }
                        }
                        return "";   
                    }
                    else if (WinRate_name == "RWinRate"){
                        if(exist == "visible"){
                            let ballpos_ = rally[rally_seq+1]["ballpos"];
                            if(ballpos_ != -1){
                                let winning_rate = rally[rally_seq+1]["winning_rate"];
                                return ballpos_name[index] + " " + winning_rate["ballpos"][ballpos].toExponential(2); 
                            } 
                        }
                        return "";
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if(exist == "visible"){
                            let ballpos = rally[rally_seq+2]["ballpos"];
                            if(ballpos != -1){
                                let winning_rate = rally[rally_seq+2]["winning_rate"];
                                return ballpos_name[index] + " " + winning_rate["ballpos"][ballpos].toExponential(2); 
                            } 
                        }
                        return "";  
                    }
                })
                .attr("visibility", "hidden");   
            }); 

            pos_list.forEach((pos, index) => {
                WinRate_rect.append("rect")
                .attr("id", `detail_pos${index}`)
                .attr("class", "add front_rect normal")
                .attr("x", x0 + side_gap + (column_width + mid_gap)*2 + column_width*1.5)
                .attr("y", y0 + top_gap + index*pos_height - pos_height*0.25)
                .attr("width", column_width*9)
                .attr("height", pos_height*1.5)
                .attr("visibility", "hidden");   
            });
            pos_list.forEach((pos, index) => {
                WinRate_rect.append("text")
                .attr("id", `detail_pos${index}`)
                .attr("class", "add front_text normal")
                .attr("x", x0 + side_gap + (column_width + mid_gap)*2 + column_width*6)
                .attr("y", y0 + top_gap + index*pos_height + pos_height/2)
                .attr("font-size", tech_height)
                .text(function(d,i){
                    if (WinRate_name == "LLWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq-1]["winning_rate"];
                            return pos_name[index] + " " + winning_rate["pos"][pos].toExponential(2);
                        }
                        return "";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq]["winning_rate"];
                            return pos_name[index] + " " + winning_rate["pos"][pos].toExponential(2);
                        }
                        return "";   
                    }
                    else if (WinRate_name == "RWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq+1]["winning_rate"];
                            return pos_name[index] + " " + winning_rate["pos"][pos].toExponential(2);
                        }
                        return "";
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if(exist == "visible"){
                            let winning_rate = rally[rally_seq+2]["winning_rate"];
                            return pos_name[index] + " " + winning_rate["pos"][pos].toExponential(2); 
                        }
                        return "";  
                    }
                })
                .attr("visibility", "hidden");   
            }); 
                    
		}
		tree("LLWinRate");
		tree("LWinRate");
		tree("RWinRate");
		tree("RRWinRate");
    }
    paint_detail(){
        let this_ = this;
        let tech_name = ["loop", "smash", "flick", "chop long", "drop shot", "block", "cut", "parrel", "lob"],
            ballpos_name = ["short backhand", "short middle", "short forehand", "half_long backhand", "half_long middle", "half_long forehand", "long backhand", "long middle", "long forehand"],
            pos_name = ["anti-sideways", "forehand", "backhand", "sideways"];

        let stroke = this_.infoArray[this_.detail_seq],
            rally_seq = stroke["stroke_context"]["rally_seq"],
            rally = stroke["stroke_context"]["rally"];

        let translate = 0;
        let tech_list = ["1","2","3","4","5","6","7","8","9"],
            ballpos_list = ["0","1","2","3","4","5","6","7","8"],
            pos_list = ["1","2","3","4"];
        //for big_back_rect
        let y0 = this_.detail_seq*(this_.rect_height + this_.sma_gap_height) + this_.top_gap - (this_.extend_dis),
            x0 = this_.LFlow_x0,
            width = this_.sma_rect_width*12 + this_.sma_gap_width*8 + this_.column_gap_width*4 + this_.big_rect_width*3 + this_.big_gap_width*2,
            height = (this_.extend_dis - this_.extend_height_gap)*2 + this_.rect_height,
            height_frame = height + this_.extend_height_gap*2,

            side_button_width = 20,
            side_button_tri_height = 20,
            big_side_gap = 5;
        if (this_.detail_seq == 0){
            y0 = this_.detail_seq*(this_.rect_height + this_.sma_gap_height) + this_.top_gap - (this_.extend_dis) + this_.extend_dis;
        }
        else if (this_.tree_seq == this_.infoArray.length-1){
            y0 = this_.tree_seq*(this_.rect_height + this_.sma_gap_height) + this_.top_gap - (this_.extend_dis - this_.extend_height_gap) - this_.extend_dis;
        }
        else{
            y0 = this_.detail_seq*(this_.rect_height + this_.sma_gap_height) + this_.top_gap - (this_.extend_dis);
        }
        //for bottom line
        let point_width = 20,
            interval = (width - side_button_width*2)/(rally.length - 1) - point_width,
            bottom_r = 8;

        //for the group of tree and table
        // 35
        let item_gap_width = ((this_.big_rect_width-this_.sma_rect_width)*3 + (this_.big_gap_width-this_.sma_gap_width)*2 + this_.column_gap_width*4 -  (side_button_width + big_side_gap)*2)/4,
            item_height = height,
            item_width = this_.sma_rect_width*3 + this_.sma_gap_width*2,
            middle_x0 = this_.Flow_x0 + this_.big_rect_width*1.5 + this_.big_gap_width - item_width/2;
       
        //for each table 
        let figure_height = 30;


        //for each tree
        let side_gap = item_width/10,
            mid_gap = item_width*3/16,
            column_width = item_width/8,
            top_gap = 5,
            tech_height = (height - top_gap*2)/(tech_list.length),
            ballpos_height = (height - top_gap*2)/(ballpos_list.length),
            pos_height = (height - top_gap*2)/(pos_list.length);

        let color_array = ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252"];

        
        //big_back_rect
        this_.svg_main_g_add.append("rect")
        .attr("id", "add detail back_rect")
        .attr("class", "add detail back_rect")
        .attr("x", x0)
        .attr("y", y0 )
        .attr("width", width)
        .attr("height", height_frame);
        
        //bottom line
        this_.svg_main_g_add.append("path")
        .attr("class", "add front_line")
        .attr("d", `M ${x0+side_button_width} ${y0+height+this_.extend_height_gap} L ${x0+width-side_button_width} ${y0+height+this_.extend_height_gap}`);

        let g_cir = this_.svg_main_g_add.append("g").attr("id", "bottom_circle")
        let g_cir_all = g_cir 
        .selectAll("g").data(rally).enter().append("g").attr("id", function(d,i){
            return "_" + i;
        });

        g_cir_all.append("circle")
        .attr("class", function(d,i){
            if((i >= rally_seq - 1)&&(i <= rally_seq + 1)){
                return "add front_circle selected";
            }
            return "add front_circle normal";
            
        })
        .attr("cx", function(d,i){
            return x0+side_button_width+bottom_r*2+interval*i;
        })
        .attr("cy", y0+height+this_.extend_height_gap)
        .attr("r", bottom_r)
        .attr("visibility", function(d,i){
            if (i == rally_seq){
                return "hidden";
            }
            return 'visible';
        });

        g_cir_all.append("text")
        .attr("class", function(d,i){
            if((i >= rally_seq - 1)&&(i <= rally_seq + 1)){
                return "add front_text selected";
            }
            return "add front_text normal";
            
        })
        .attr("x", function(d,i){
            return x0+side_button_width+bottom_r*2+interval*i;
        })
        .attr("y", y0+height+this_.extend_height_gap)
        .attr("font-size", bottom_r*1.2)
        .text(function(d,i){
            return ""+(i+1);
        })

        g_cir.append("path")
        .attr("class", "add front_circle selected")
        .attr("d", function(d,i){
            let side = 10,
                x = x0+side_button_width+bottom_r*2+interval*rally_seq,
                y = y0+height+this_.extend_height_gap;
            return `M ${x-side} ${y} L ${x} ${y-side} L ${x+side} ${y} L ${x} ${y+side}`;
        })
        g_cir.append("text")
        .attr("class", "add front_text selected")
        .attr("x", function(d,i){
            return x0+side_button_width+bottom_r*2+interval*rally_seq;
        })
        .attr("y", y0+height+this_.extend_height_gap)
        .attr("font-size", bottom_r*1.2)
        .text(function(d,i){
            return ""+(rally_seq+1);
        })

        //a g for all tables and tree
        let g = this_.svg_main_g_add.append("g").attr("id", "table_tree");
        let g_table = g.append("g")
        .attr("id", "table"),
            g_tree = g.append("g")
        .attr("id", "tree");

        rally.forEach((stroke, index)=>{
            let g_stroke = g_tree.append("g").attr("id", "stroke_" + index),
                g_stroke_table = g_table.append("g").attr("id", "stroke_" + index);
            //table
            let ballpos = stroke["ballpos"],
                tech = stroke["tech"],
                pos = stroke["pos"],
                x0 = middle_x0 + (item_width + item_gap_width) * 2 * (index - rally_seq),
                pos_top_list = ["", "SRC/image/top_antisideways.svg", "SRC/image/top_forehand.svg", "SRC/image/top_backhand.svg", "SRC/image/top_sideways.svg"],
                pos_bot_list = ["", "SRC/image/bot_antisideways.svg", "SRC/image/bot_forehand.svg", "SRC/image/bot_backhand.svg", "SRC/image/bot_sideways.svg"],
                table_height = height - figure_height,
                table_width_Tlong = table_height * 587/948, 
                table_width_Thalf = table_height * 670/948,
                table_width_Tshort = table_height * 764/948,
                
                table_width_Bshort = table_height * 889/948,
                table_width_Bhalf = table_height * 996/948,
                table_width_Blong = table_height * 1116/948,

                table_height_Tlong = table_height * 99/948, 
                table_height_Thalf = table_height * 112/948,
                table_height_Tshort = table_height * 129/948,
                
                table_height_Bshort = table_height * 130/948,
                table_height_Bhalf = table_height * 169/948,
                table_height_Blong = table_height * 152/948,

                table_half_height = table_height * 430/948,

                ballpos_top_trans = [[(item_width - table_width_Tshort)/2 + table_width_Tshort * 5 / 6  + 2,
                                      table_height_Tlong + table_height_Thalf + table_height_Tshort/2 + 2], 
                                     [(item_width - table_width_Tshort)/2 + table_width_Tshort * 3 / 6  + 1,
                                      table_height_Tlong + table_height_Thalf + table_height_Tshort/2 + 2], 
                                     [(item_width - table_width_Tshort)/2 + table_width_Tshort * 1 / 6 ,
                                      table_height_Tlong + table_height_Thalf + table_height_Tshort/2 + 2],

                                     [(item_width - table_width_Thalf)/2 + table_width_Thalf * 5 / 6  + 2,
                                      table_height_Tlong + table_height_Thalf/2 + 1], 
                                     [(item_width - table_width_Thalf)/2 + table_width_Thalf * 3 / 6  + 1,
                                      table_height_Tlong + table_height_Thalf/2 + 1], 
                                     [(item_width - table_width_Thalf)/2 + table_width_Thalf * 1 / 6,
                                      table_height_Tlong + table_height_Thalf/2 + 1], 

                                     [(item_width - table_width_Tlong)/2 + table_width_Tlong * 5 / 6  + 2,
                                      table_height_Tlong/2], 
                                     [(item_width - table_width_Tlong)/2 + table_width_Tlong * 3 / 6  + 1,
                                      table_height_Tlong/2], 
                                     [(item_width - table_width_Tlong)/2 + table_width_Tlong * 1 / 6,
                                      table_height_Tlong/2]],
                ballpos_bottom_trans = [[(item_width - table_width_Bshort)/2 + table_width_Bshort * 1 / 6,
                                      table_half_height + table_height_Bshort/2 ], 
                                     [(item_width - table_width_Bshort)/2 + table_width_Bshort * 3 / 6  + 1,
                                      table_half_height + table_height_Bshort/2 ], 
                                     [(item_width - table_width_Bshort)/2 + table_width_Bshort * 5 / 6 + 2,
                                      table_half_height + table_height_Bshort/2],

                                     [(item_width - table_width_Bhalf)/2 + table_width_Bhalf * 1 / 6,
                                      table_half_height + table_height_Bshort + table_height_Bhalf/2], 
                                     [(item_width - table_width_Bhalf)/2 + table_width_Bhalf * 3 / 6  + 1,
                                      table_half_height + table_height_Bshort + table_height_Bhalf/2], 
                                     [(item_width - table_width_Bhalf)/2 + table_width_Bhalf * 5 / 6 + 2,
                                      table_half_height + table_height_Bshort + table_height_Bhalf/2], 

                                     [(item_width - table_width_Blong)/2 + table_width_Blong * 1 / 6,
                                       table_half_height + table_height_Bshort + table_height_Bhalf + table_height_Blong/2], 
                                     [(item_width - table_width_Blong)/2 + table_width_Blong * 3 / 6  + 1,
                                       table_half_height + table_height_Bshort + table_height_Bhalf + table_height_Blong/2], 
                                     [(item_width - table_width_Blong)/2 + table_width_Blong * 5 / 6 + 2,
                                       table_half_height + table_height_Bshort + table_height_Bhalf + table_height_Blong/2]],
                player = stroke["hitplayer"],
                circle_r = 5;

                //back_rect
                g_stroke_table.append("rect")
                .attr("class", "add back_rect")
                .attr("x", x0)
                .attr("y", y0)
                .attr("width", item_width)
                .attr("height", item_height);

                //fron_rect
                    //table_back
                g_stroke_table.append("svg:image")
                .attr("xlink:href", function(d,i){
                    if(this_.playerTop == 1){
                        return "SRC/image/detail_1.svg";
                    }
                    return "SRC/image/detail_0.svg";
                })
                .attr("x", x0)
                .attr("y", function(d,i){
                    let player = stroke["hitplayer"];
                    if(this_.playerTop == 0){
                        if(player == 0){
                            return y0 + figure_height;
                        }
                        return y0 ;
                    }
                    else{
                        if(player == 1){
                            return y0 + figure_height;
                        }
                        return y0 ;
                    }  
                })
                .attr("width", item_width)
                .attr("height", item_height - figure_height);
                    //ball
                if((ballpos != -1 )&&(ballpos != 9)){

                    g_stroke.append("svg:circle")
                    .attr("class", function(d,i){
                        return `add front_circle tech${tech}`
                    })
                    .attr("cx", function(d,i){
                        if(this_.playerTop == 0){
                            if(player == 0){
                                return x0 + ballpos_bottom_trans[ballpos][0];
                            }
                            return x0 + ballpos_top_trans[ballpos][0];
                        }
                        else{
                            if(player == 1){
                                return x0 + ballpos_bottom_trans[ballpos][0];
                            }
                            return x0 + ballpos_top_trans[ballpos][0];
                        }
                        
                    })
                    .attr("cy", function(d,i){
                        if(this_.playerTop == 0){
                            if(player == 0){
                                return y0 + figure_height + ballpos_bottom_trans[ballpos][1];
                            }
                            return y0  + ballpos_top_trans[ballpos][1];
                        }
                        else{
                            if(player == 1){
                                return y0 + figure_height + ballpos_bottom_trans[ballpos][1];
                            }
                            return y0 + ballpos_top_trans[ballpos][1];
                        }
                        
                    })
                    .attr("r", circle_r)
                }
                    //figure_pos
                if(pos != 0){
                    g_stroke.append("svg:image")
                    .attr("xlink:href", function(d,i){
                        if(this_.playerTop == 1){
                            if(player == 1){
                                return pos_top_list[pos];
                            }
                            else if(player == 0){
                                return pos_bot_list[pos];
                            }
                        }
                        else{
                            if(player == 1){
                                return pos_bot_list[pos];
                            }
                            else if(player == 0){
                                return pos_top_list[pos];
                            }

                        }
                       
                        
                    })
                    .attr("x", function(d,i){
                        if(this_.playerTop == 0){
                            if(player == 0){//top
                                return x0 + (item_width-table_width_Tlong)/2 + table_width_Tlong/4*(pos-1);
                            }
                            return x0 + (item_width-table_width_Blong)/2 + table_width_Blong/4*(4-pos);//bottom
                        }
                        else{
                            if(player == 1){//top
                                return x0 + (item_width-table_width_Tlong)/2 + table_width_Tlong/4*(pos-1);
                            }
                            return x0 + (item_width-table_width_Blong)/2 + table_width_Blong/4*(4-pos);//bottom
                        }
                        
                    })
                    .attr("y", function(d,i){
                        let player = stroke["hitplayer"];
                        if(this_.playerTop == 0){
                            if(player == 0){
                                return y0;
                            }
                            return y0 + height - figure_height;
                        }
                        else{
                            if(player == 1){
                                return y0;
                            }
                            return y0 + height - figure_height;
                        }
                        
                    })
                    .attr("width", figure_height)
                    .attr("height", figure_height);
                }
               

                

            //tree
            if(index < rally.length - 1){
                let ballpos = rally[index+1]["ballpos"],
                    max = -1, 
                    min = 1,
                    tmp_keys,
                    tmp_value,
                    tmp_array,
                    fill_scale,
                    winning_rate = rally[index+1]["winning_rate"],
                    available = rally[index+1]["available"],
                    x0 = middle_x0 + (item_width + item_gap_width) * 2 * (index - rally_seq) + (item_width + item_gap_width);
                //back_rect
                g_stroke.append("rect")
                .attr("class", "add back_rect")
                .attr("x", x0)
                .attr("y", y0)
                .attr("width", item_width)
                .attr("height", item_height);
                //front
                tmp_keys = Object.keys(rally[index+1]["available"]["tech"]);
                tmp_keys.forEach((key)=>{
                    if ((key != -1)&&(key != 0)&&(key != 10)){
                        let tmp= rally[index+1]["winning_rate"]["tech"][key];
                        if (max < tmp){
                            max = tmp;
                        }
                        if (min > tmp){
                            min = tmp;
                        }
                    }
                })
                if(ballpos != -1){
                    tmp_keys = Object.keys(rally[index+1]["available"]["ballpos"]);
                    tmp_keys.forEach((key)=>{
                        if ((key != -1)&&(key != 9)){
                            let tmp= rally[index+1]["winning_rate"]["ballpos"][key];
                            if (max < tmp){
                                max = tmp;
                            }
                            if (min > tmp){
                                min = tmp;
                            }
                        }
                    })
                }
                tmp_keys = Object.keys(rally[index+1]["available"]["pos"]);
                tmp_keys.forEach((key)=>{
                    if ((key != -1)&&(key != 0)){
                        let tmp= rally[index+1]["winning_rate"]["pos"][key];
                        if (max < tmp){
                            max = tmp;
                        }
                        if (min > tmp){
                            min = tmp;
                        }
                    }
                })
                tmp_value = (max - min)/color_array.length;
                tmp_array = [];
                for(let j = 0; j < color_array.length; j++){
                    tmp_array.push(min + tmp_value * j);
                }
                fill_scale = d3.scaleThreshold().domain(tmp_array)
                .range(color_array);


                tech_list.forEach((tech, index_1) => {
                    g_stroke.append("rect")
                    .attr("id", `rect_${index_1}`)
                    .attr("class", "add front_rect")
                    .attr("x", x0+ side_gap)
                    .attr("y", y0 + top_gap + index_1*tech_height)
                    .attr("width", column_width)
                    .attr("height", tech_height)
                    .attr("fill", function(d,i){
                        if(index == rally.length - 1){
                            return "";
                        }
                        return fill_scale(winning_rate["tech"][tech]); 
                       
                    })
                    .attr("visibility", function(d,i){
                        if(index == rally.length - 1){
                            return "hidden";
                        }
                        if(tech in available["tech"]){
                            return "visible";
                        }
                        else{
                            return "hidden";
                        }
                    })
                    .on("mouseover", function(d,i){
                        let tmp = "#detail_tech" + d3.select(this).attr("id").split("_")[1];
                        g_stroke.selectAll(tmp).attr("visibility", "visible");
                    })
                    .on("mouseout", function(d,i){
                        let tmp = "#detail_tech" + d3.select(this).attr("id").split("_")[1];
                        g_stroke.selectAll(tmp).attr("visibility", "hidden");
                    })
                });

                ballpos_list.forEach((ballpos_item, index_1) => {
                    g_stroke.append("rect")
                    .attr("id",`rect_${index_1}`)
                    .attr("class", "add front_rect")
                    .attr("x", x0 + side_gap + column_width + mid_gap)
                    .attr("y", y0 + top_gap + index_1*ballpos_height)
                    .attr("width", column_width)
                    .attr("height", ballpos_height)
                    .attr("fill", function(d,i){
                        if(ballpos != -1){
                            return fill_scale(winning_rate["ballpos"][ballpos_item]); 
                        }
                        return "";                       
                    })
                    .attr("visibility", function(d,i){
                        if(ballpos == -1){
                            return "hidden";
                        }
                        if(ballpos_item in available["ballpos"]){
                            return "visible";
                        }
                        else{
                            return "hidden";
                        }
                       
                    })
                    .on("mouseover", function(d,i){
                        let tmp = "#detail_ballpos" + d3.select(this).attr("id").split("_")[1];
                        g_stroke.selectAll(tmp).attr("visibility", "visible");
                    })
                    .on("mouseout", function(d,i){
                        let tmp = "#detail_ballpos" + d3.select(this).attr("id").split("_")[1];

                        g_stroke.selectAll(tmp).attr("visibility", "hidden");
                    })
                });

                pos_list.forEach((pos, index_1) => {
                    g_stroke.append("rect")
                    .attr("id", `rect_${index_1}`)
                    .attr("class", "add front_rect")
                    .attr("x", x0 + side_gap + (column_width + mid_gap)*2)
                    .attr("y", y0 + top_gap + index_1*pos_height)
                    .attr("width", column_width)
                    .attr("height", pos_height)
                    .attr("fill", function(d,i){
                        if(index == rally.length - 1){
                            return "";
                        }
                        return fill_scale(winning_rate["pos"][pos]); 
                       
                    })
                    .attr("visibility", function(d,i){
                        if(index == rally.length - 1){
                            return "hidden";
                        }
                        if(pos in available["pos"]){
                            return "visible";
                        }
                        else{
                            return "hidden";
                        }
                    })
                    .on("mouseover", function(d,i){
                        let tmp = "#detail_pos" + d3.select(this).attr("id").split("_")[1];
                        console.log(tmp)
                        g_stroke.selectAll(tmp).attr("visibility", "visible");
                    })
                    .on("mouseout", function(d,i){
                        let tmp = "#detail_pos" + d3.select(this).attr("id").split("_")[1];

                        g_stroke.selectAll(tmp).attr("visibility", "hidden");
                    })
                });

                g_stroke.append("path")
                    .attr("class", function(d,i){
                        return `score front_line player${rally[index+1]["hitplayer"]}`
                    })
                    .attr("d", function(d,i){
                        let stroke = rally[index + 1]
                        let tech = stroke["tech"],
                            ballpos = stroke["ballpos"],
                            pos = stroke["pos"];

                        let x_0 = x0 - item_gap_width,
                            y_0 = y0 + height/2,
                            
                            x_1 = x0 + side_gap,
                            tech_index = tech_list.indexOf(""+tech),
                            y_1 = y0 + top_gap + tech_index*tech_height + tech_height/2,
                            
                            x_2 = x0 + side_gap + column_width + mid_gap,
                            ballpos_index = ballpos_list.indexOf(""+ballpos),
                            y_2 = y0 + top_gap + ballpos_index*ballpos_height + tech_height/2,

                            x_3 = x0 + side_gap + (column_width + mid_gap)*2,
                            pos_index = pos_list.indexOf(""+pos),
                            y_3 = y0 + top_gap + pos_index*pos_height + tech_height/2,

                            x_4 = x0 + item_width + item_gap_width,
                            y_4 = y0 + height/2;
                        if(ballpos_index != -1){
                            if(tech_index != -1){
                                if(pos_index != -1){
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_1+column_width} ${y_1} L ${x_2} ${y_2} M ${x_2+column_width} ${y_2} L ${x_3} ${y_3} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_1+column_width} ${y_1} L ${x_2} ${y_2} `;
                                }
                            }
                            else{
                                if(pos_index != -1){
                                    return `M ${x_2+column_width} ${y_2} L ${x_3} ${y_3} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return "";
                                }
                            }
                        }
                        else{
                            if(tech_index != -1){
                                if(pos_index != -1){
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return `M ${x_0} ${y_0} L ${x_1} ${y_1} `;
                                }
                            }
                            else{
                                if(pos_index != -1){
                                    return `M ${x_3+column_width} ${y_3} L ${x_4} ${y_4}`;
                                }
                                else{
                                    return "";
                                }
                            }
                        }          
                    })

                tech_list.forEach((tech, index_1) => {
                    g_stroke.append("rect")
                    .attr("id", `detail_tech${index_1}`)
                    .attr("class", "add front_rect normal")
                    .attr("x", x0 + side_gap + column_width*1.5)
                    .attr("y", y0 + top_gap + index_1*tech_height - tech_height)
                    .attr("width", column_width*7)
                    .attr("height", tech_height*3)
                    .attr("visibility", "hidden");   
                });
                tech_list.forEach((tech, index_1) => {
                    g_stroke.append("text")
                    .attr("id", `detail_tech${index_1}`)
                    .attr("class", "add front_text normal")
                    .attr("x", x0 + side_gap + column_width*5)
                    .attr("y", y0 + top_gap + index_1*tech_height + tech_height/2)
                    .attr("font-size", tech_height)
                    .text( function(d,i){
                        return tech_name[index_1] + " " + winning_rate["tech"][tech].toExponential(2);
                    })
                    .attr("visibility", "hidden");   
                });

                ballpos_list.forEach((ballpos_item, index_1) => {
                    g_stroke.append("rect")
                    .attr("id", `detail_ballpos${index_1}`)
                    .attr("class", "add front_rect normal")
                    .attr("x", x0 + side_gap + column_width + mid_gap+ column_width*1.5)
                    .attr("y", y0 + top_gap + index_1*ballpos_height- ballpos_height)
                    .attr("width", column_width*11)
                    .attr("height", ballpos_height*3)
                    .attr("visibility", "hidden");
                      
                });
                ballpos_list.forEach((ballpos_item, index_1) => {
                    g_stroke.append("text")
                    .attr("id", `detail_ballpos${index_1}`)
                    .attr("class", "add front_text normal")
                    .attr("x", x0 + side_gap + column_width + mid_gap+ column_width*7)
                    .attr("y", y0 + top_gap + index_1*ballpos_height+ ballpos_height/2)
                    .attr("font-size", tech_height)
                    .text(function(d,i){
                        if(ballpos != -1){
                            // console.log(ballpos_name, index_1, winning_rate, ballpos, stroke, winning_rate["ballpos"], ballpos)
                            return ballpos_name[index_1] + " " + winning_rate["ballpos"][ballpos_item].toExponential(2); 
                        }    
                        return "";
                    })
                    .attr("visibility", "hidden");   
                }); 

                pos_list.forEach((pos, index_1) => {
                    g_stroke.append("rect")
                    .attr("id", `detail_pos${index_1}`)
                    .attr("class", "add front_rect normal")
                    .attr("x", x0 + side_gap + (column_width + mid_gap)*2 + column_width*1.5)
                    .attr("y", y0 + top_gap + index_1*pos_height - pos_height*0.25)
                    .attr("width", column_width*9)
                    .attr("height", pos_height*1.5)
                    .attr("visibility", "hidden");   
                });
                pos_list.forEach((pos, index_1) => {
                    g_stroke.append("text")
                    .attr("id", `detail_pos${index_1}`)
                    .attr("class", "add front_text normal")
                    .attr("x", x0 + side_gap + (column_width + mid_gap)*2 + column_width*6)
                    .attr("y", y0 + top_gap + index_1*pos_height + pos_height/2)
                    .attr("font-size", tech_height)
                    .text(function(d,i){
                        return pos_name[index_1] + " " + winning_rate["pos"][pos].toExponential(2);
                    })
                    .attr("visibility", "hidden");   
                }); 
            }
        })
    
        //side button
        this_.svg_main_g_add.append("rect")
        .attr("id", "add button_rect")
        .attr("class", "add button_rect")
        .attr("x", x0)
        .attr("y", y0)
        .attr("width", side_button_width)
        .attr("height", height_frame)
        .on("click", function(d,i){
            translate += 1;
            this_.svg_main_g_add.selectAll("g#table_tree").transition('position')
            .duration(750).attr("transform", `translate(${translate*(item_width+item_gap_width)*2},${0})`);

            let g_selected = g_cir.selectAll("g").filter(function(d,i){
                let seq = d3.select(this).attr("id").split("_")[1];
                if ((seq >= rally_seq - 1 - translate)&&(seq <= rally_seq + 1 - translate)){
                    return 1;
                } 
                return 0;
            });
            let g_normal = g_cir.selectAll("g").filter(function(d,i){
                let seq = d3.select(this).attr("id").split("_")[1];
                if ((seq >= rally_seq - 1 - translate)&&(seq <= rally_seq + 1 - translate)){
                    return 0;
                } 
                return 1;
            });
            g_selected.selectAll("circle").attr("class", "add front_circle selected");
            g_selected.selectAll("text").attr("class", "add front_text selected");
            g_normal.selectAll("circle").attr("class", "add front_circle normal");
            g_normal.selectAll("text").attr("class", "add front_text normal");

        });
        this_.svg_main_g_add.append("rect")
        .attr("id", "add button_rect")
        .attr("class", "add button_rect")
        .attr("x", x0 + width - side_button_width)
        .attr("y", y0 )
        .attr("width", side_button_width)
        .attr("height", height_frame)
        .on("click", function(d,i){
            translate -= 1;
            this_.svg_main_g_add.selectAll("g#table_tree").transition('position')
            .duration(750).attr("transform", `translate(${translate*(item_width+item_gap_width)*2},${0})`);

            let g_selected = g_cir.selectAll("g").filter(function(d,i){
                let seq = d3.select(this).attr("id").split("_")[1];
                if ((seq >= rally_seq - 1 - translate)&&(seq <= rally_seq + 1 - translate)){
                    return 1;
                } 
                return 0;
            });
            let g_normal = g_cir.selectAll("g").filter(function(d,i){
                let seq = d3.select(this).attr("id").split("_")[1];
                if ((seq >= rally_seq - 1 - translate)&&(seq <= rally_seq + 1 - translate)){
                    return 0;
                } 
                return 1;
            });
            g_selected.selectAll("circle").attr("class", "add front_circle selected");
            g_selected.selectAll("text").attr("class", "add front_text selected");
            g_normal.selectAll("circle").attr("class", "add front_circle normal");
            g_normal.selectAll("text").attr("class", "add front_text normal");
        });
        this_.svg_main_g_add.append("path")
        .attr("class", "add button_tri")
        .attr("d", `M ${x0+5} ${y0 + height_frame/2 - side_button_tri_height/2} L ${x0+15} ${y0 + height_frame/2} L ${x0+5} ${y0 + height_frame/2 + side_button_tri_height/2}`)
        .on("click", function(d,i){
            translate += 1;
            this_.svg_main_g_add.selectAll("g#table_tree").transition('position')
            .duration(750).attr("transform", `translate(${translate*(item_width+item_gap_width)*2},${0})`);

            let g_selected = g_cir.selectAll("g").filter(function(d,i){
                let seq = d3.select(this).attr("id").split("_")[1];
                if ((seq >= rally_seq - 1 - translate)&&(seq <= rally_seq + 1 - translate)){
                    return 1;
                } 
                return 0;
            });
            let g_normal = g_cir.selectAll("g").filter(function(d,i){
                let seq = d3.select(this).attr("id").split("_")[1];
                if ((seq >= rally_seq - 1 - translate)&&(seq <= rally_seq + 1 - translate)){
                    return 0;
                } 
                return 1;
            });
            g_selected.selectAll("circle").attr("class", "add front_circle selected");
            g_selected.selectAll("text").attr("class", "add front_text selected");
            g_normal.selectAll("circle").attr("class", "add front_circle normal");
            g_normal.selectAll("text").attr("class", "add front_text normal");

        });
        this_.svg_main_g_add.append("path")
        .attr("class", "add button_tri")
        .attr("d", `M ${x0+width-side_button_width+5} ${y0 + height_frame/2} L ${x0+width-side_button_width+15} ${y0 + height_frame/2- side_button_tri_height/2} L ${x0+width-side_button_width+15} ${y0 + height_frame/2 + side_button_tri_height/2}`)
        .on("click", function(d,i){
            translate -= 1;
            this_.svg_main_g_add.selectAll("g#table_tree").transition('position')
            .duration(750).attr("transform", `translate(${translate*(item_width+item_gap_width)*2},${0})`);

            let g_selected = g_cir.selectAll("g").filter(function(d,i){
                let seq = d3.select(this).attr("id").split("_")[1];
                if ((seq >= rally_seq - 1 - translate)&&(seq <= rally_seq + 1 - translate)){
                    return 1;
                } 
                return 0;
            });
            let g_normal = g_cir.selectAll("g").filter(function(d,i){
                let seq = d3.select(this).attr("id").split("_")[1];
                if ((seq >= rally_seq - 1 - translate)&&(seq <= rally_seq + 1 - translate)){
                    return 0;
                } 
                return 1;
            });
            g_selected.selectAll("circle").attr("class", "add front_circle selected");
            g_selected.selectAll("text").attr("class", "add front_text selected");
            g_normal.selectAll("circle").attr("class", "add front_circle normal");
            g_normal.selectAll("text").attr("class", "add front_text normal");
        });
    }
    paint_button(){
        let this_ = this;

        this.svg_main_height = parseInt(this.svg_main.style("height").split("p")[0]);
        let svg_button_width =  parseInt(this_.svg_button.style("width").split("p")[0]);
        let gap = 5;
        let x0 = gap,
            scroll_width = 0,
            scroll_height =  this_.div_height/this_.svg_main_height*this_.div_height,
            scroll_r = 6,
            width = svg_button_width - gap*2 - scroll_width;

        let g = this_.svg_button_g.selectAll("g")
        .data(this_.infoArray)
        .enter().append("g")
        .attr("id", function(d,i){return "_" + i;})
        .on("mouseover", function(d,i){
            // this_.svg_score.select("g#" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "score back_rect hover");
            this_.svg_main.selectAll("g#_" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "main back_rect hover");
            this_.svg_button.selectAll("g#_" + i).selectAll("rect").attr("class", "button front_rect hover");
            this_.svg_button.selectAll("g#_" + i).selectAll("image").attr("visibility", "visible");
        })
        .on("mouseout", function(d,i){
            // this_.svg_score.select("g#" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "score back_rect normal");
            this_.svg_main.selectAll("g#_" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "main back_rect normal");
            this_.svg_button.selectAll("g#_" + i).selectAll("rect").attr("class", "button front_rect hidden");
            this_.svg_button.selectAll("g#_" + i).selectAll("image").attr("visibility", "hidden");

        });

        g.append("rect")
        .attr("id", "icon_back")
        .attr("class", "button front_rect hidden")
        .attr("x", x0)
        .attr("y", function(d,i){
            return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap; 
        })
        .attr("width", width)
        .attr("height", this_.rect_height);


        g.append("svg:image")
        .attr("xlink:href", "SRC/image/Winning_Rate.png")
        .attr("id", "icon1")
        .attr("x", x0)
        .attr("y", function(d,i){
            return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap; 
        })
        .attr("width", width)
        .attr("height", (this_.rect_height - gap)/2)
        .on("click", function(d,i){
            this_.svg_main_g.selectAll("g").filter(function(){
                        let tmp = d3.select(this).attr("id").split("_")[0];
                        if (tmp == "add"){
                            return 1;
                        } 
                        return 0
                }).remove();

            this_.svg_main_g_add.selectAll("*").remove();

            if(""+i in this_.icon1_dict){//有了,delete label1, recover others(3 svgs), remove view
                delete this_.icon1_dict[""+i];
                this_.svg_main_g.selectAll("g").filter(function(){
                        return 1;
                }).transition('position')
                .duration(750).attr("transform", `translate(${0},${0})`);
                this_.svg_main_g_add.selectAll("g").filter(function(){
                        return 1;
                }).transition('position')
                .duration(750).attr("transform", `translate(${0},${0})`);
                this_.svg_score.selectAll("g").filter(function(){
                        return 1;
                }).transition('position')
                .duration(750).attr("transform", `translate(${0},${0})`);

                this_.svg_button.selectAll("g").filter(function(){
                        return 1;
                }).transition('position')
                .duration(750).attr("transform", `translate(${0},${0})`);

                this_.svg_main_g.selectAll("g").filter(function(){
                            let name = d3.select(this).attr("id").split("_")[0],
                                seq = parseInt(d3.select(this).attr("id").split("_")[1]);
                            // console.log(name, seq);
                            if ((name == "line") && (seq == i || seq == i-1)){
                                return 1;
                            } 
                            return 0;
                        }).selectAll("line").transition().duration(750).attr("opacity",1);

            }
            else{
                this_.icon1_dict = {}
                this_.icon1_dict[""+i] = 0;//没有,record label1
                if(""+i in this_.icon2_dict){
                    delete this_.icon2_dict[""+i];//delete label2
                    //paint the ith win tree
                    this_.tree_seq = i;
                    this_.paint_tree();
                }
                else{//move others away(3 svgs), recover self
                    this_.svg_main_g.selectAll("g").filter(function(){
                            let name = d3.select(this).attr("id").split("_")[0],
                                seq = parseInt(d3.select(this).attr("id").split("_")[1]);
                            // console.log(name, seq);
                            if ((name == "line") && (seq == this_.tree_seq || seq == this_.tree_seq - 1 || seq == this_.detail_seq || seq == this_.detail_seq - 1)){
                                return 1;
                            } 
                            return 0;
                        }).selectAll("line").transition().duration(750).attr("opacity",1);

                    this_.svg_main_g.selectAll("g").filter(function(){
                            let name = d3.select(this).attr("id").split("_")[0],
                                seq = parseInt(d3.select(this).attr("id").split("_")[1]);
                            // console.log(name, seq);
                            if ((name == "line") && (seq == i || seq == i-1)){
                                return 1;
                            } 
                            return 0;
                        }).selectAll("line").transition().duration(750).attr("opacity",0);

                    
                    if (i == 0){

                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis*2})`);

                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis*2})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);


                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis*2})`);

                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);
                        //paint the ith win tree
                    }
                    else if(i == this_.infoArray.length - 1){
                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j < i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis*2})`);

                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j < i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis*2})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);


                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j < i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis*2})`);

                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);
                        //paint the ith win tree
                    }
                    else{
                        this_.svg_main.selectAll("g").filter(function(){
                        let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                        if (j < i){
                            return 1;
                        } 
                        return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);

                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);

                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${0})`);


                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j < i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${0})`);

                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j < i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);

                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);

                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${0})`);
                        //paint the ith win tree
                    }
                    this_.tree_seq = i;
                    setTimeout("timeline.paint_tree()",750);
                }
            }
        })
        .attr("visibility", "hidden");

         g.append("svg:image")
        .attr("xlink:href", "SRC/image/Detail.png")
        .attr("id", "icon2")
        .attr("x", x0)
        .attr("y", function(d,i){
            return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + (this_.rect_height - gap)/2 + gap; 
        })
        .attr("width", width)
        .attr("height", (this_.rect_height - gap)/2)
        .on("click", function(d,i){
            this_.svg_main_g.selectAll("g").filter(function(){
                        let tmp = d3.select(this).attr("id").split("_")[0];
                        if (tmp == "add"){
                            return 1;
                        } 
                        return 0
                }).remove();

            this_.svg_main_g_add.selectAll("*").remove();
            if(""+i in this_.icon2_dict){//有了,delete label2 recover others(3 svgs), remove view
                delete this_.icon2_dict[""+i];
                // this_.svg_main.selectAll("g#detail_" + i).remove();

                this_.svg_main_g.selectAll("g").filter(function(){
                        return 1;
                }).transition('position')
                .duration(750).attr("transform", `translate(${0},${0})`);

                this_.svg_score.selectAll("g").filter(function(){
                        return 1;
                }).transition('position')
                .duration(750).attr("transform", `translate(${0},${0})`);

                this_.svg_button.selectAll("g").filter(function(){
                        return 1;
                }).transition('position')
                .duration(750).attr("transform", `translate(${0},${0})`);

                this_.svg_main_g.selectAll("g").filter(function(){
                            let name = d3.select(this).attr("id").split("_")[0],
                                seq = parseInt(d3.select(this).attr("id").split("_")[1]);
                            // console.log(name, seq);
                            if ((name == "line") && (seq == i || seq == i-1)){
                                return 1;
                            } 
                            return 0;
                        }).selectAll("line").transition().duration(750).attr("opacity",1);
            }
            else{
                this_.icon2_dict = {}
                this_.icon2_dict[""+i] = 0;//没有,record label2
                if(""+i in this_.icon1_dict){
                    delete this_.icon1_dict[""+i];//delete label1
                    this_.detail_seq = i;
                    this_.paint_detail();
                    //paint the ith win tree
                }
                else{//move others away(3 svgs), recover self
                    this_.svg_main_g.selectAll("g").filter(function(){
                            let name = d3.select(this).attr("id").split("_")[0],
                                seq = parseInt(d3.select(this).attr("id").split("_")[1]);
                            // console.log(name, seq);
                            if ((name == "line") && (seq == this_.detail_seq || seq == this_.detail_seq-1 || seq == this_.tree_seq || seq == this_.tree_seq - 1 )){
                                return 1;
                            } 
                            return 0;
                        }).selectAll("line").transition().duration(750).attr("opacity",1);
                    
                    this_.svg_main_g.selectAll("g").filter(function(){
                            let name = d3.select(this).attr("id").split("_")[0],
                                seq = parseInt(d3.select(this).attr("id").split("_")[1]);
                            // console.log(name, seq);
                            if ((name == "line") && (seq == i || seq == i-1)){
                                return 1;
                            } 
                            return 0;
                        }).selectAll("line").transition().duration(750).attr("opacity",0);
                    if (i == 0){

                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis*2})`);

                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis*2})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);


                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis*2})`);

                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);
                        //paint the ith win tree
                    }
                    else if(i == this_.infoArray.length - 1){
                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j < i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis*2})`);

                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j < i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis*2})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);


                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j < i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis*2})`);

                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);
                        //paint the ith win tree
                    }
                    else{
                        this_.svg_main.selectAll("g").filter(function(){
                        let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                        if (j < i){
                            return 1;
                        } 
                        return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);

                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);

                        this_.svg_main.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${0})`);


                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j < i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);

                        this_.svg_score.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${0})`);

                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j < i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${-this_.extend_dis})`);

                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j > i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${this_.extend_dis})`);

                        this_.svg_button.selectAll("g").filter(function(){
                            let j = parseInt(d3.select(this).attr("id").split("_")[1]);
                            if (j == i){
                                return 1;
                            } 
                            return 0
                        }).transition('position')
                        .duration(750).attr("transform", `translate(${0},${0})`);
                        //paint the ith win tree
                    }
                    //paint the ith win tree
                    this_.detail_seq = i;
                    setTimeout("timeline.paint_detail()",750);
                }
            }
        })
        .attr("visibility", "hidden");
        
    }
    switch_direction(){
        let this_ = this;

        this_.svg_main_g.selectAll("g").filter(
            function(d,i){
                let tmp = d3.select(this).attr("id").split("_")[0];
                        if (tmp == "glyph"){
                            return 1;
                        } 
                        return 0
            }
        ).remove();
        let g_glyph = this_.svg_main_g.selectAll("g#glyph")
        .data(this_.infoArray)
        .enter().append("g")
        .attr("id", function(d,i){return "glyph_" + i;})
        .on("mouseover", function(d,i){
            // this_.svg_score.select("g#" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "score back_rect hover");
            this_.svg_main.selectAll("g#_" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "main back_rect hover");
        })
        .on("mouseout", function(d,i){
            // this_.svg_score.select("g#" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "score back_rect normal");
            this_.svg_main.selectAll("g#_" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "main back_rect normal");

        });

        function Flow(Flow_name){
            
            let Flow_glyph;
            if (Flow_name == "LLFlow"){
                Flow_glyph = g_glyph.append("g").attr("id", "LLFlow");
            }
            else if (Flow_name == "LFlow"){
                Flow_glyph = g_glyph.append("g").attr("id", "LFlow");
            }
            else if (Flow_name == "Flow"){
                Flow_glyph = g_glyph.append("g").attr("id", "Flow");
            }
            else if (Flow_name == "RFlow"){
                Flow_glyph = g_glyph.append("g").attr("id", "RFlow");
            }
            else if (Flow_name == "RRFlow"){
                Flow_glyph = g_glyph.append("g").attr("id", "RRFlow");
            }


            Flow_glyph.append("path")//fan
            .attr("class", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"]
                if (Flow_name == "LLFlow"){
                    if (rally_seq - 2 < 0){
                        return "";
                    }
                    return `main front_fan player${rally[rally_seq-2]["hitplayer"]}`
                }
                else if (Flow_name == "LFlow"){
                    if (rally_seq - 1 < 0){
                        return "";
                    }
                    return `main front_fan player${rally[rally_seq-1]["hitplayer"]}`
                }
                else if (Flow_name == "Flow"){
                    return `main front_fan player${rally[rally_seq]["hitplayer"]}`
                }
                else if (Flow_name == "RFlow"){
                    if (rally_seq + 1 >=  rally.length){
                        return "";
                    }
                    return `main front_fan player${rally[rally_seq+1]["hitplayer"]}`
                }
                else if (Flow_name == "RRFlow"){
                    if (rally_seq + 2 >=  rally.length){
                        return "";
                    }
                    return `main front_fan player${rally[rally_seq+2]["hitplayer"]}`
                }
            })
            .attr("d",function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"]
                if (Flow_name == "LLFlow"){
                    if (rally_seq - 2 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 2]["ballpos"];
                    let tmp_x = ballpos%3;
                    if (rally[rally_seq-2]["hitplayer"] == this_.playerTop){
                        let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                        if (ballpos == -1){
                            x0 = this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                        }
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                        let x1 = x0 + this_.sma_rect_width;
                        let y1 = y0;
                        let x2 = x0 + this_.sma_rect_width/2;
                        let y2 = y0 + this_.sma_rect_width/(2*Math.sqrt(3));
                        let r = this_.sma_rect_width/(Math.sqrt(3));

                        return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                        //paint a fan with downward angle 120
                    }
                    else {
                        //paint a fan with upward angle
                        let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                        if (ballpos == -1){
                            x0 = this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                        }
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                        let x1 = x0 + this_.sma_rect_width;
                        let y1 = y0;
                        let x2 = x0 + this_.sma_rect_width/2;
                        let y2 = y0 - this_.sma_rect_width/(2*Math.sqrt(3));
                        let r = this_.sma_rect_width/(Math.sqrt(3))

                        return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                    }

                }
                else if (Flow_name == "LFlow"){
                    if (rally_seq - 1 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 1]["ballpos"];
                    let tmp_x = ballpos%3;
                    if (rally[rally_seq-1]["hitplayer"] == this_.playerTop){
                        let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                        if (ballpos == -1){
                            x0 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                        }
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                        let x1 = x0 + this_.sma_rect_width;
                        let y1 = y0;
                        let x2 = x0 + this_.sma_rect_width/2;
                        let y2 = y0 + this_.sma_rect_width/(2*Math.sqrt(3));
                        let r = this_.sma_rect_width/(Math.sqrt(3))

                        return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                        //paint a fan with downward angle
                    }
                    else {
                        //paint a fan with upward angle
                        let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                        if (ballpos == -1){
                            x0 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                        }
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                        let x1 = x0 + this_.sma_rect_width;
                        let y1 = y0;
                        let x2 = x0 + this_.sma_rect_width/2;
                        let y2 = y0 - this_.sma_rect_width/(2*Math.sqrt(3));
                        let r = this_.sma_rect_width/(Math.sqrt(3))

                        return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                    }
                }
                else if (Flow_name == "Flow"){
                    let ballpos = rally[rally_seq]["ballpos"];
                    let tmp_x = ballpos%3;
                    if (rally[rally_seq]["hitplayer"] == this_.playerTop){
                        let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width);
                        if (ballpos == -1){
                            x0 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width)
                        }
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                        let x1 = x0 + this_.big_rect_width;
                        let y1 = y0;
                        let x2 = x0 + this_.big_rect_width/2;
                        let y2 = y0 + this_.big_rect_width/(2*Math.sqrt(3));
                        let r = this_.big_rect_width/(Math.sqrt(3))

                        return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                        //paint a fan with downward angle
                    }
                    else {
                        //paint a fan with upward angle
                        let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width);
                        if (ballpos == -1){
                            x0 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width)
                        }
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                        let x1 = x0 + this_.big_rect_width;
                        let y1 = y0;
                        let x2 = x0 + this_.big_rect_width/2;
                        let y2 = y0 - this_.big_rect_width/(2*Math.sqrt(3));
                        let r = this_.big_rect_width/(Math.sqrt(3))

                        return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                    }
                }
                else if (Flow_name == "RFlow"){
                    if (rally_seq + 1 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 1]["ballpos"];
                    let tmp_x = ballpos%3;
                    if (rally[rally_seq+1]["hitplayer"] == this_.playerTop){
                        let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                        if (ballpos == -1){
                            x0 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                        }
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                        let x1 = x0 + this_.sma_rect_width;
                        let y1 = y0;
                        let x2 = x0 + this_.sma_rect_width/2;
                        let y2 = y0 + this_.sma_rect_width/(2*Math.sqrt(3));
                        let r = this_.sma_rect_width/(Math.sqrt(3))

                        return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                        //paint a fan with downward angle
                    }
                    else {
                        //paint a fan with upward angle
                        let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                        if (ballpos == -1){
                            x0 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                        }
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                        let x1 = x0 + this_.sma_rect_width;
                        let y1 = y0;
                        let x2 = x0 + this_.sma_rect_width/2;
                        let y2 = y0 - this_.sma_rect_width/(2*Math.sqrt(3));
                        let r = this_.sma_rect_width/(Math.sqrt(3))

                        return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                    }
                }
                else if (Flow_name == "RRFlow"){
                    if (rally_seq + 2 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 2]["ballpos"];
                    let tmp_x = ballpos%3;
                    if (rally[rally_seq+2]["hitplayer"] == this_.playerTop){
                        let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                        if (ballpos == -1){
                            x0 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                        }
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                        let x1 = x0 + this_.sma_rect_width;
                        let y1 = y0;
                        let x2 = x0 + this_.sma_rect_width/2;
                        let y2 = y0 + this_.sma_rect_width/(2*Math.sqrt(3));
                        let r = this_.sma_rect_width/(Math.sqrt(3))

                        return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                        //paint a fan with downward angle
                    }
                    else {
                        //paint a fan with upward angle
                        let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                        if (ballpos == -1){
                            x0 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                        }
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                        let x1 = x0 + this_.sma_rect_width;
                        let y1 = y0;
                        let x2 = x0 + this_.sma_rect_width/2;
                        let y2 = y0 - this_.sma_rect_width/(2*Math.sqrt(3));
                        let r = this_.sma_rect_width/(Math.sqrt(3))

                        return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                    }
                }
            })

            Flow_glyph.append("path")//1/4 fan-sector-short
            .attr("class", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"];

                if (Flow_name == "LLFlow"){
                    if (rally_seq - 2 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 2]["ballpos"];
                    let tech = rally[rally_seq - 2]["tech"];
                    if (ballpos == -1){
                        return `main front_fan_sector tech${tech} lose`;
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "LFlow"){
                    if (rally_seq - 1 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 1]["ballpos"];
                    let tech = rally[rally_seq - 1]["tech"];
                    if (ballpos == -1){
                        return `main front_fan_sector tech${tech} lose`;
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "Flow"){
                    let ballpos = rally[rally_seq]["ballpos"];
                    let tech = rally[rally_seq]["tech"];
                    if (ballpos == -1){
                        return `main front_fan_sector tech${tech} lose`;
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "RFlow"){
                    if (rally_seq + 1 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 1]["ballpos"];
                    let tech = rally[rally_seq + 1]["tech"];
                    if (ballpos == -1){
                        return `main front_fan_sector tech${tech} lose`;
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "RRFlow"){
                    if (rally_seq + 2 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 2]["ballpos"];
                    let tech = rally[rally_seq + 2]["tech"];
                    if (ballpos == -1){
                        return `main front_fan_sector tech${tech} lose`;
                    }
                    return `main front_fan_sector tech${tech}`;
                }
            })
            .attr("d", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"];
                let x_fc_array = [Math.sqrt(3)/2, -Math.sqrt(3)/2, -1/2, 0, 1/2, Math.sqrt(3)/2];//multiply r
                let y_ft_or_b_array = [1/2, 1/2, Math.sqrt(3)/2, 1, Math.sqrt(3)/2, 1/2];//multiply r

                if (Flow_name == "LLFlow"){
                    if (rally_seq - 2 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 2]["ballpos"];
                    let pos = rally[rally_seq - 2]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        if (rally[rally_seq-2]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let x0 = this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                            let x1 = this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];
                            let x2 = this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 ;
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a 1/4 fan(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let x0 = this_.sma_rect_width -(this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos]);
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos];
                            let x1 = this_.sma_rect_width -(this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1]);
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos+1];
                            let x2 = this_.sma_rect_width -(this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2); 
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 ;
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;

                            //paint a 1/4 fan(direction in light of the stroke position) with upward angle
                        }
                         
                    }
                    if (rally[rally_seq-2]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r_ = r * 2/3;
                        let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                        let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];

                        let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos];
                        let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                        }

                        //paint a 1/4 fan-sector-short(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.sma_rect_width/(Math.sqrt(3))
                        let r_ = r * 2/3;
                        let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos];
                        let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos+1];

                        let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos];
                        let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-short(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "LFlow"){
                    if (rally_seq - 1 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 1]["ballpos"];
                    let pos = rally[rally_seq - 1]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        if (rally[rally_seq-1]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let x0 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                            let x1 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];
                            let x2 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 ;
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a 1/4 fan(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let x0 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos];
                            let x1 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos+1];
                            let x2 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2; 
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 ;
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a 1/4 fan(direction in light of the stroke position) with upward angle
                        }
                         
                    }
                    if (rally[rally_seq-1]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r_ = r * 2/3;
                        let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                        let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];

                        let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos];
                        let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                        }
                        
                        //paint a 1/4 fan-sector-short(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.sma_rect_width/(Math.sqrt(3))
                        let r_ = r * 2/3;
                        let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos];
                        let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos+1];

                        let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos];
                        let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                        }
                    };
                }
                else if (Flow_name == "Flow"){
                    let ballpos = rally[rally_seq]["ballpos"];
                    let pos = rally[rally_seq]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        if (rally[rally_seq]["hitplayer"] == this_.playerTop){
                            let r = this_.big_rect_width/(Math.sqrt(3))
                            let x0 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                            let x1 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];
                            let x2 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 ;
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a 1/4 fan(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.big_rect_width/(Math.sqrt(3))
                            let x0 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos];
                            let x1 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos+1];
                            let x2 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2; 
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 ;
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a 1/4 fan(direction in light of the stroke position) with upward angle
                        }
                         
                    }
                    if (rally[rally_seq]["hitplayer"] == this_.playerTop){
                        let r = this_.big_rect_width/(Math.sqrt(3));
                        let r_ = r * 2/3;
                        let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                        let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];

                        let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r_*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos];
                        let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r_*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-short(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.big_rect_width/(Math.sqrt(3))
                        let r_ = r * 2/3;
                        let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos];
                        let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos+1];

                        let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r_*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos];
                        let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r_*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-short(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "RFlow"){
                    if (rally_seq + 1 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 1]["ballpos"];
                    let pos = rally[rally_seq + 1]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        if (rally[rally_seq+1]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let x0 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                            let x1 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];
                            let x2 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 ;
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a 1/4 fan(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let x0 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos];
                            let x1 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos+1];
                            let x2 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2; 
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 ;
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a 1/4 fan(direction in light of the stroke position) with upward angle
                        }
                         
                    }
                    if (rally[rally_seq+1]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r_ = r * 2/3;
                        let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                        let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];

                        let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos];
                        let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-short(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.sma_rect_width/(Math.sqrt(3))
                        let r_ = r * 2/3;
                        let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos];
                        let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos+1];

                        let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos];
                        let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-short(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "RRFlow"){
                    if (rally_seq + 2 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 2]["ballpos"];
                    let pos = rally[rally_seq + 2]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        if (rally[rally_seq+2]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let x0 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                            let x1 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];
                            let x2 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 ;
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a 1/4 fan(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let x0 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos];
                            let x1 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos+1];
                            let x2 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2; 
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 ;
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a 1/4 fan(direction in light of the stroke position) with upward angle
                        }
                         
                    }
                    if (rally[rally_seq+2]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r_ = r * 2/3;
                        let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                        let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];

                        let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos];
                        let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-short(direction in light of the stroke position) with downward angle
                    }
                    else {

                        let r = this_.sma_rect_width/(Math.sqrt(3))
                        let r_ = r * 2/3;
                        let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos];
                        let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos+1];

                        let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos];
                        let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-short(direction in light of the stroke position) with upward angle
                    };
                }
            })

            Flow_glyph.append("path")//1/4 fan-sector-middle
            .attr("class", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"];

                if (Flow_name == "LLFlow"){
                    if (rally_seq - 2 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 2]["ballpos"];
                    let tech = rally[rally_seq - 2]["tech"];
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 1){
                        return "";
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "LFlow"){
                    if (rally_seq - 1 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 1]["ballpos"];
                    let tech = rally[rally_seq - 1]["tech"];
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 1){
                        return "";
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "Flow"){
                    let ballpos = rally[rally_seq]["ballpos"];
                    let tech = rally[rally_seq]["tech"];
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 1){
                        return "";
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "RFlow"){
                    if (rally_seq + 1 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 1]["ballpos"];
                    let tech = rally[rally_seq + 1]["tech"];
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 1){
                        return "";
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "RRFlow"){
                    if (rally_seq + 2 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 2]["ballpos"];
                    let tech = rally[rally_seq + 2]["tech"];
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 1){
                        return "";
                    }
                    return `main front_fan_sector tech${tech}`;
                }
            })
            .attr("d", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"];
                let x_fc_array = [Math.sqrt(3)/2, -Math.sqrt(3)/2, -1/2, 0, 1/2, Math.sqrt(3)/2];//multiply r
                let y_ft_or_b_array = [1/2, 1/2, Math.sqrt(3)/2, 1, Math.sqrt(3)/2, 1/2];//multiply r
                let fan_sector_gap_big = 2;
                let fan_sector_gap_sma = 1;
                if (Flow_name == "LLFlow"){
                    if (rally_seq - 2 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 2]["ballpos"];
                    let pos = rally[rally_seq - 2]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        return ""; 
                    }
                    if (ballpos/3 < 1){
                        return "";
                    }
                    if (rally[rally_seq-2]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 2/3 - fan_sector_gap_sma;
                        let r2 = r/3;
                        let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                        let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                        let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 2/3- fan_sector_gap_sma;
                        let r2 = r/3;
                        let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                        let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                        let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "LFlow"){
                    if (rally_seq - 1 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 1]["ballpos"];
                    let pos = rally[rally_seq - 1]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 1){
                        return "";
                    }
                    if (rally[rally_seq-1]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 2/3 - fan_sector_gap_sma;
                        let r2 = r/3;
                        let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                        let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                        let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 2/3 - fan_sector_gap_sma;
                        let r2 = r/3;
                        let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                        let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                        let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "Flow"){
                    let ballpos = rally[rally_seq]["ballpos"];
                    let pos = rally[rally_seq]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 1){
                        return "";
                    }
                    if (rally[rally_seq]["hitplayer"] == this_.playerTop){
                        let r = this_.big_rect_width/(Math.sqrt(3));
                        let r1 = r * 2/3 - fan_sector_gap_big;
                        let r2 = r/3;
                        let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                        let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                        let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.big_rect_width/(Math.sqrt(3));
                        let r1 = r * 2/3 - fan_sector_gap_big;
                        let r2 = r/3;
                        let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                        let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                        let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "RFlow"){
                    if (rally_seq + 1 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 1]["ballpos"];
                    let pos = rally[rally_seq + 1]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 1){
                        return "";
                    }
                    if (rally[rally_seq+1]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 2/3 - fan_sector_gap_sma;
                        let r2 = r/3;
                        let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                        let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                        let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 2/3 - fan_sector_gap_sma;
                        let r2 = r/3;
                        let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                        let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                        let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "RRFlow"){
                    if (rally_seq + 2 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 2]["ballpos"];
                    let pos = rally[rally_seq + 2]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                       return "";
                    }
                    if (ballpos/3 < 1){
                        return "";
                    }
                    if (rally[rally_seq+2]["hitplayer"] == this_.playerTop){

                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 2/3 - fan_sector_gap_sma;
                        let r2 = r/3;
                        let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                        let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                        let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with downward angle
                    }
                    else {

                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 2/3 - fan_sector_gap_sma;
                        let r2 = r/3;
                        let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                        let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                        let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with upward angle
                    };
                }
            })

            Flow_glyph.append("path")//1/4 fan-sector-long
            .attr("class", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"];

                if (Flow_name == "LLFlow"){
                    if (rally_seq - 2 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 2]["ballpos"];
                    let tech = rally[rally_seq - 2]["tech"];
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 2){
                        return "";
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "LFlow"){
                    if (rally_seq - 1 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 1]["ballpos"];
                    let tech = rally[rally_seq - 1]["tech"];
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 2){
                        return "";
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "Flow"){
                    let ballpos = rally[rally_seq]["ballpos"];
                    let tech = rally[rally_seq]["tech"];
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 2){
                        return "";
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "RFlow"){
                    if (rally_seq + 1 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 1]["ballpos"];
                    let tech = rally[rally_seq + 1]["tech"];
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 2){
                        return "";
                    }
                    return `main front_fan_sector tech${tech}`;
                }
                else if (Flow_name == "RRFlow"){
                    if (rally_seq + 2 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 2]["ballpos"];
                    let tech = rally[rally_seq + 2]["tech"];
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 2){
                        return "";
                    }
                    return `main front_fan_sector tech${tech}`;
                }
            })
            .attr("d", function(d,i){
                let rally_seq = d["stroke_context"]["rally_seq"];
                let rally = d["stroke_context"]["rally"];
                let x_fc_array = [Math.sqrt(3)/2, -Math.sqrt(3)/2, -1/2, 0, 1/2, Math.sqrt(3)/2];//multiply r
                let y_ft_or_b_array = [1/2, 1/2, Math.sqrt(3)/2, 1, Math.sqrt(3)/2, 1/2];//multiply r
                let fan_sector_gap_big = 2;
                let fan_sector_gap_sma = 1;

                if (Flow_name == "LLFlow"){
                    if (rally_seq - 2 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 2]["ballpos"];
                    let pos = rally[rally_seq - 2]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        return ""; 
                    }
                    if (ballpos/3 < 2){
                        return "";
                    }
                    if (rally[rally_seq-2]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 1/3 - fan_sector_gap_sma;
                        let r2 = 1;
                        let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                        let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                        let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-long(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 1/3 - fan_sector_gap_sma;
                        let r2 = 1;
                        let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                        let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                        let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-long(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "LFlow"){
                    if (rally_seq - 1 < 0){
                        return "";
                    }
                    let ballpos = rally[rally_seq - 1]["ballpos"];
                    let pos = rally[rally_seq - 1]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 2){
                        return "";
                    }
                    if (rally[rally_seq-1]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 1/3 - fan_sector_gap_sma;
                        let r2 = 1;
                        let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                        let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                        let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-long(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 1/3 - fan_sector_gap_sma;
                        let r2 = 1;
                        let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                        let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                        let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-long(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "Flow"){
                    let ballpos = rally[rally_seq]["ballpos"];
                    let pos = rally[rally_seq]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 2){
                        return "";
                    }
                    if (rally[rally_seq]["hitplayer"] == this_.playerTop){
                        let r = this_.big_rect_width/(Math.sqrt(3));
                        let r1 = r * 1/3 - fan_sector_gap_big;
                        let r2 = 1;
                        let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                        let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                        let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-long(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.big_rect_width/(Math.sqrt(3));
                        let r1 = r * 1/3 - fan_sector_gap_big;
                        let r2 = 1;
                        let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                        let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                        let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-long(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "RFlow"){
                    if (rally_seq + 1 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 1]["ballpos"];
                    let pos = rally[rally_seq + 1]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                        return "";
                    }
                    if (ballpos/3 < 2){
                        return "";
                    }
                    if (rally[rally_seq+1]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 1/3 - fan_sector_gap_sma;
                        let r2 = 1;
                        let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                        let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                        let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-long(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 1/3 - fan_sector_gap_sma;
                        let r2 = 1;
                        let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                        let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                        let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-long(direction in light of the stroke position) with upward angle
                    };
                }
                else if (Flow_name == "RRFlow"){
                    if (rally_seq + 2 >=  rally.length){
                        return "";
                    }
                    let ballpos = rally[rally_seq + 2]["ballpos"];
                    let pos = rally[rally_seq + 2]["pos"];
                    let tmp_x = ballpos%3;
                    if (ballpos == -1){
                       return "";
                    }
                    if (ballpos/3 < 2){
                        return "";
                    }
                    if (rally[rally_seq+2]["hitplayer"] == this_.playerTop){
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 1/3 - fan_sector_gap_sma;
                        let r2 = 1;
                        let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                        let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                        let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-long(direction in light of the stroke position) with downward angle
                    }
                    else {
                        let r = this_.sma_rect_width/(Math.sqrt(3));
                        let r1 = r * 1/3 - fan_sector_gap_sma;
                        let r2 = 1;
                        let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                        let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                        let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                        let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                        let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                        let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                        let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                        let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                        
                        if(pos == 0){
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                        }
                        else{
                            return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                        }
                        //paint a 1/4 fan-sector-long(direction in light of the stroke position) with upward angle
                    };
                }
            })
        }
        Flow("LLFlow");
        Flow("LFlow");
        Flow("Flow");
        Flow("RFlow");
        Flow("RRFlow");
    }
    paint_main(){//svg_main -> g#_i g#line_i g#glyph_i
        let this_ = this;

        let g = this_.svg_main_g.selectAll("g")
        .data(this_.infoArray)
        .enter().append("g")
        .attr("id", function(d,i){return "_" + i;})
        .on("mouseover", function(d,i){
            // this_.svg_score.select("g#" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "score back_rect hover");
            this_.svg_main.selectAll("g#_" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "main back_rect hover");
        })
        .on("mouseout", function(d,i){
            // this_.svg_score.select("g#" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "score back_rect normal");
            this_.svg_main.selectAll("g#_" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "main back_rect normal");

        });

        let g_line = this_.svg_main_g.selectAll("g#line")
        .data(this_.infoArray)
        .enter().append("g")
        .attr("id", function(d,i){return "line_" + i;})
        .on("mouseover", function(d,i){
            // this_.svg_score.select("g#" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "score back_rect hover");
            this_.svg_main.selectAll("g#_" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "main back_rect hover");
        })
        .on("mouseout", function(d,i){
            // this_.svg_score.select("g#" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "score back_rect normal");
            this_.svg_main.selectAll("g#_" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "main back_rect normal");

        });

        let g_glyph = this_.svg_main_g.selectAll("g#glyph")
        .data(this_.infoArray)
        .enter().append("g")
        .attr("id", function(d,i){return "glyph_" + i;})
        .on("mouseover", function(d,i){
            // this_.svg_score.select("g#" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "score back_rect hover");
            this_.svg_main.selectAll("g#_" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "main back_rect hover");
        })
        .on("mouseout", function(d,i){
            // this_.svg_score.select("g#" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "score back_rect normal");
            this_.svg_main.selectAll("g#_" + i).selectAll("g#back_rect").selectAll("rect").attr("class", "main back_rect normal");

        });



        function Flow(Flow_name){
            let Flow;
                if (Flow_name == "LLFlow"){
                    Flow = g.append("g").attr("id", "LLFlow");
                }
                else if (Flow_name == "LFlow"){
                    Flow = g.append("g").attr("id", "LFlow");
                }
                else if (Flow_name == "Flow"){
                    Flow = g.append("g").attr("id", "Flow");
                }
                else if (Flow_name == "RFlow"){
                    Flow = g.append("g").attr("id", "RFlow");
                }
                else if (Flow_name == "RRFlow"){
                    Flow = g.append("g").attr("id", "RRFlow");
                }

            let Flow_line;
                if (Flow_name == "LLFlow"){
                    Flow_line = g_line.append("g").attr("id", "LLFlow");
                }
                else if (Flow_name == "LFlow"){
                    Flow_line = g_line.append("g").attr("id", "LFlow");
                }
                else if (Flow_name == "Flow"){
                    Flow_line = g_line.append("g").attr("id", "Flow");
                }
                else if (Flow_name == "RFlow"){
                    Flow_line = g_line.append("g").attr("id", "RFlow");
                }
                else if (Flow_name == "RRFlow"){
                    Flow_line = g_line.append("g").attr("id", "RRFlow");
                }

            let Flow_glyph;
                if (Flow_name == "LLFlow"){
                    Flow_glyph = g_glyph.append("g").attr("id", "LLFlow");
                }
                else if (Flow_name == "LFlow"){
                    Flow_glyph = g_glyph.append("g").attr("id", "LFlow");
                }
                else if (Flow_name == "Flow"){
                    Flow_glyph = g_glyph.append("g").attr("id", "Flow");
                }
                else if (Flow_name == "RFlow"){
                    Flow_glyph = g_glyph.append("g").attr("id", "RFlow");
                }
                else if (Flow_name == "RRFlow"){
                    Flow_glyph = g_glyph.append("g").attr("id", "RRFlow");
                }


            let Flow_rect = Flow.append("g")
                .attr("id", "back_rect");

                Flow_rect.append("rect")//left
                .attr("class", `main back_rect normal`)
                .attr("x", function(d,i){//this_可以读取？
                    if (Flow_name == "LLFlow"){
                        return this_.LLFlow_x0;
                    }
                    else if (Flow_name == "LFlow"){
                        return this_.LFlow_x0;
                    }
                    else if (Flow_name == "Flow"){
                        return this_.Flow_x0;
                    }
                    else if (Flow_name == "RFlow"){
                        return this_.RFlow_x0;
                    }
                    else if (Flow_name == "RRFlow"){
                        return this_.RRFlow_x0;
                    }
                })
                .attr("y", function(d,i){
                    return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap;
                })
                .attr("width", function(d,i){
                    if (Flow_name == "Flow"){
                        return this_.big_rect_width;
                    }
                    else {
                        return this_.sma_rect_width;
                    }
                })
                .attr("height", function(d,i){
                    return this_.rect_height;
                });

                Flow_rect.append("rect")//middle
                .attr("class", `main back_rect normal`)
                .attr("x", function(d,i){//this_可以读取？
                    if (Flow_name == "LLFlow"){
                        return this_.LLFlow_x0 + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (Flow_name == "LFlow"){
                        return this_.LFlow_x0 + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (Flow_name == "Flow"){
                        return this_.Flow_x0 + this_.big_rect_width + this_.big_gap_width;
                    }
                    else if (Flow_name == "RFlow"){
                        return this_.RFlow_x0 + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (Flow_name == "RRFlow"){
                        return this_.RRFlow_x0 + this_.sma_rect_width + this_.sma_gap_width;
                    }
                })
                .attr("y", function(d,i){
                    return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap;
                })
                .attr("width", function(d,i){
                    if (Flow_name == "Flow"){
                        return this_.big_rect_width;
                    }
                    else {
                        return this_.sma_rect_width;
                    }
                })
                .attr("height", function(d,i){
                    return this_.rect_height;
                });

                Flow_rect.append("rect")//right
                .attr("class", `main back_rect normal`)
                .attr("x", function(d,i){//this_可以读取？
                    if (Flow_name == "LLFlow"){
                        return this_.LLFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (Flow_name == "LFlow"){
                        return this_.LFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (Flow_name == "Flow"){
                        return this_.Flow_x0 + this_.big_rect_width + this_.big_gap_width + this_.big_rect_width + this_.big_gap_width;
                    }
                    else if (Flow_name == "RFlow"){
                        return this_.RFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (Flow_name == "RRFlow"){
                        return this_.RRFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width + this_.sma_gap_width;
                    }
                })
                .attr("y", function(d,i){
                    return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap;
                })
                .attr("width", function(d,i){
                    if (Flow_name == "Flow"){
                        return this_.big_rect_width;
                    }
                    else {
                        return this_.sma_rect_width;
                    }
                })
                .attr("height", function(d,i){
                    return this_.rect_height;
                });
            

            let dashW_scale;
            if(1){
                let domain_array = [],
                    range_array = [],
                    num_level = 5,
                    domain_gra = 40/num_level,
                    range_gra = 20/num_level;
                for(let i = 0; i < num_level; i ++){
                    domain_array.push(i*domain_gra);
                    range_array.push((num_level + 1 - i)*range_gra);
                }
                range_array.push(range_gra);
                console.log(domain_array, range_array,"here")
                dashW_scale = d3.scaleThreshold().domain(domain_array).range(range_array);
            }
            Flow_line.append("line")
                .attr("class", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"]
                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        return `main front_line player${rally[rally_seq-2]["hitplayer"]}`
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        return `main front_line player${rally[rally_seq-1]["hitplayer"]}`
                    }
                    else if (Flow_name == "Flow"){
                        return `main front_line player${rally[rally_seq]["hitplayer"]}`
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        return `main front_line player${rally[rally_seq+1]["hitplayer"]}`
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        return `main front_line player${rally[rally_seq+2]["hitplayer"]}`
                    }
                })
                .attr("stroke-dasharray", function(d,i){
                    if(i < this_.infoArray.length - 1){
                        let domain_value = dashW_scale(this_.infoArray[i+1].time_context - d.time_context);
                        console.log(this_.infoArray[i+1].time_context - d.time_context);
                        let last_half = ",5";
                        return domain_value + last_half;
                    } else
                    if(i >= this_.infoArray.length - 1){
                        return "1,0";
                    }
                    

                    
                })
                .attr("x1", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return 0;
                        }
                        let ballpos = rally[rally_seq - 2]["ballpos"];
                        if (ballpos == -1){
                            return this_.LLFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2;
                        }
                        let tmp_x = ballpos%3;
                        return this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                       
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return 0;
                        }
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        if (ballpos == -1){
                            return this_.LFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2;
                        }
                        let tmp_x = ballpos%3;
                        return this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                    }
                    else if (Flow_name == "Flow"){
                        let ballpos = rally[rally_seq]["ballpos"];
                        if (ballpos == -1){
                            return this_.Flow_x0 + this_.big_rect_width + this_.big_gap_width + this_.big_rect_width/2;
                        }
                        let tmp_x = ballpos%3;
                        return this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2;
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        if (ballpos == -1){
                            return this_.RFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2;
                        }
                        let tmp_x = ballpos%3;
                        return this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        if (ballpos == -1){
                            return this_.RRFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2;
                        }
                        let tmp_x = ballpos%3;
                        return this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                    }
                })
                .attr("y1", function(d,i){
                    return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                })
                .attr("x2", function(d,i){
                    let rally_seq,
                        rally;
                    if ((this_.num_player == 1)||((this_.num_player == 2)&&(i/2.0 >= this_.shorter_length))){
                        if(i + 1 >= this_.infoArray.length){
                            return 0;
                        }
                        rally_seq = this_.infoArray[i+1]["stroke_context"]["rally_seq"];
                        rally = this_.infoArray[i+1]["stroke_context"]["rally"];
                    }
                    else{
                        if(i + 2 >= this_.infoArray.length){
                            return 0;
                        }
                        rally_seq = this_.infoArray[i+2]["stroke_context"]["rally_seq"];
                        rally = this_.infoArray[i+2]["stroke_context"]["rally"];
                    }

                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return 0;
                        }
                        let ballpos = rally[rally_seq - 2]["ballpos"];
                        if (ballpos == -1){
                            return this_.LLFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2;
                        }
                        let tmp_x = ballpos%3;
                        return this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                       
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return 0;
                        }
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        if (ballpos == -1){
                            return this_.LFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2;
                        }
                        let tmp_x = ballpos%3;
                        return this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                    }
                    else if (Flow_name == "Flow"){
                        let ballpos = rally[rally_seq]["ballpos"];
                        if (ballpos == -1){
                            return this_.Flow_x0 + this_.big_rect_width + this_.big_gap_width + this_.big_rect_width/2;
                        }
                        let tmp_x = ballpos%3;
                        return this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2;
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        if (ballpos == -1){
                            return this_.RFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2;
                        }
                        let tmp_x = ballpos%3;
                        return this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        if (ballpos == -1){
                            return this_.RRFlow_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2;
                        }
                        let tmp_x = ballpos%3;
                        return this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                    }
                })
                .attr("y2", function(d,i){
                    if(this_.num_player == 1||((this_.num_player == 2)&&(i/2.0 >= this_.shorter_length))){
                        return (i+1)*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                    }
                    return (i+2)*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2; 
                })
                .attr("visibility", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "hidden";
                        };
                       
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "hidden";
                        };
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "hidden";
                        }
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "hidden";
                        }
                    }

                    if (this_.num_player == 1||((this_.num_player == 2)&&(i/2.0 >= this_.shorter_length))){
                        if(i + 1 >= this_.infoArray.length){
                            return "hidden";
                        }
                        rally_seq = this_.infoArray[i+1]["stroke_context"]["rally_seq"];
                        rally = this_.infoArray[i+1]["stroke_context"]["rally"];
                    }
                    else{
                        if(i + 2 >= this_.infoArray.length){
                            return "hidden";
                        }
                        rally_seq = this_.infoArray[i+2]["stroke_context"]["rally_seq"];
                        rally = this_.infoArray[i+2]["stroke_context"]["rally"];
                    }

                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "hidden";
                        };
                       
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "hidden";
                        };
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "hidden";
                        }
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "hidden";
                        }
                    }
                    return "visible";
                })


            Flow_glyph.append("path")//fan
                .attr("class", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"]
                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        return `main front_fan player${rally[rally_seq-2]["hitplayer"]}`
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        return `main front_fan player${rally[rally_seq-1]["hitplayer"]}`
                    }
                    else if (Flow_name == "Flow"){
                        return `main front_fan player${rally[rally_seq]["hitplayer"]}`
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        return `main front_fan player${rally[rally_seq+1]["hitplayer"]}`
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        return `main front_fan player${rally[rally_seq+2]["hitplayer"]}`
                    }
                })
                .attr("d",function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"]
                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 2]["ballpos"];
                        let tmp_x = ballpos%3;
                        if (rally[rally_seq-2]["hitplayer"] == this_.playerTop){
                            let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                            if (ballpos == -1){
                                x0 = this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                            }
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                            let x1 = x0 + this_.sma_rect_width;
                            let y1 = y0;
                            let x2 = x0 + this_.sma_rect_width/2;
                            let y2 = y0 + this_.sma_rect_width/(2*Math.sqrt(3));
                            let r = this_.sma_rect_width/(Math.sqrt(3));

                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a fan with downward angle 120
                        }
                        else {
                            //paint a fan with upward angle
                            let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                            if (ballpos == -1){
                                x0 = this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                            }
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                            let x1 = x0 + this_.sma_rect_width;
                            let y1 = y0;
                            let x2 = x0 + this_.sma_rect_width/2;
                            let y2 = y0 - this_.sma_rect_width/(2*Math.sqrt(3));
                            let r = this_.sma_rect_width/(Math.sqrt(3))

                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                        }

                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let tmp_x = ballpos%3;
                        if (rally[rally_seq-1]["hitplayer"] == this_.playerTop){
                            let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                            if (ballpos == -1){
                                x0 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                            }
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                            let x1 = x0 + this_.sma_rect_width;
                            let y1 = y0;
                            let x2 = x0 + this_.sma_rect_width/2;
                            let y2 = y0 + this_.sma_rect_width/(2*Math.sqrt(3));
                            let r = this_.sma_rect_width/(Math.sqrt(3))

                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a fan with downward angle
                        }
                        else {
                            //paint a fan with upward angle
                            let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                            if (ballpos == -1){
                                x0 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                            }
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                            let x1 = x0 + this_.sma_rect_width;
                            let y1 = y0;
                            let x2 = x0 + this_.sma_rect_width/2;
                            let y2 = y0 - this_.sma_rect_width/(2*Math.sqrt(3));
                            let r = this_.sma_rect_width/(Math.sqrt(3))

                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                        }
                    }
                    else if (Flow_name == "Flow"){
                        let ballpos = rally[rally_seq]["ballpos"];
                        let tmp_x = ballpos%3;
                        if (rally[rally_seq]["hitplayer"] == this_.playerTop){
                            let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width);
                            if (ballpos == -1){
                                x0 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width)
                            }
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                            let x1 = x0 + this_.big_rect_width;
                            let y1 = y0;
                            let x2 = x0 + this_.big_rect_width/2;
                            let y2 = y0 + this_.big_rect_width/(2*Math.sqrt(3));
                            let r = this_.big_rect_width/(Math.sqrt(3))

                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a fan with downward angle
                        }
                        else {
                            //paint a fan with upward angle
                            let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width);
                            if (ballpos == -1){
                                x0 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width)
                            }
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                            let x1 = x0 + this_.big_rect_width;
                            let y1 = y0;
                            let x2 = x0 + this_.big_rect_width/2;
                            let y2 = y0 - this_.big_rect_width/(2*Math.sqrt(3));
                            let r = this_.big_rect_width/(Math.sqrt(3))

                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                        }
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let tmp_x = ballpos%3;
                        if (rally[rally_seq+1]["hitplayer"] == this_.playerTop){
                            let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                            if (ballpos == -1){
                                x0 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                            }
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                            let x1 = x0 + this_.sma_rect_width;
                            let y1 = y0;
                            let x2 = x0 + this_.sma_rect_width/2;
                            let y2 = y0 + this_.sma_rect_width/(2*Math.sqrt(3));
                            let r = this_.sma_rect_width/(Math.sqrt(3))

                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a fan with downward angle
                        }
                        else {
                            //paint a fan with upward angle
                            let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                            if (ballpos == -1){
                                x0 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                            }
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                            let x1 = x0 + this_.sma_rect_width;
                            let y1 = y0;
                            let x2 = x0 + this_.sma_rect_width/2;
                            let y2 = y0 - this_.sma_rect_width/(2*Math.sqrt(3));
                            let r = this_.sma_rect_width/(Math.sqrt(3))

                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                        }
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let tmp_x = ballpos%3;
                        if (rally[rally_seq+2]["hitplayer"] == this_.playerTop){
                            let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                            if (ballpos == -1){
                                x0 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                            }
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                            let x1 = x0 + this_.sma_rect_width;
                            let y1 = y0;
                            let x2 = x0 + this_.sma_rect_width/2;
                            let y2 = y0 + this_.sma_rect_width/(2*Math.sqrt(3));
                            let r = this_.sma_rect_width/(Math.sqrt(3))

                            return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                            //paint a fan with downward angle
                        }
                        else {
                            //paint a fan with upward angle
                            let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width);
                            if (ballpos == -1){
                                x0 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width)
                            }
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                            let x1 = x0 + this_.sma_rect_width;
                            let y1 = y0;
                            let x2 = x0 + this_.sma_rect_width/2;
                            let y2 = y0 - this_.sma_rect_width/(2*Math.sqrt(3));
                            let r = this_.sma_rect_width/(Math.sqrt(3))

                            return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                        }
                    }
                })

            Flow_glyph.append("path")//1/4 fan-sector-short
                .attr("class", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 2]["ballpos"];
                        let tech = rally[rally_seq - 2]["tech"];
                        if (ballpos == -1){
                            return `main front_fan_sector tech${tech} lose`;
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let tech = rally[rally_seq - 1]["tech"];
                        if (ballpos == -1){
                            return `main front_fan_sector tech${tech} lose`;
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "Flow"){
                        let ballpos = rally[rally_seq]["ballpos"];
                        let tech = rally[rally_seq]["tech"];
                        if (ballpos == -1){
                            return `main front_fan_sector tech${tech} lose`;
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let tech = rally[rally_seq + 1]["tech"];
                        if (ballpos == -1){
                            return `main front_fan_sector tech${tech} lose`;
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let tech = rally[rally_seq + 2]["tech"];
                        if (ballpos == -1){
                            return `main front_fan_sector tech${tech} lose`;
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                })
                .attr("d", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];
                    let x_fc_array = [Math.sqrt(3)/2, -Math.sqrt(3)/2, -1/2, 0, 1/2, Math.sqrt(3)/2];//multiply r
                    let y_ft_or_b_array = [1/2, 1/2, Math.sqrt(3)/2, 1, Math.sqrt(3)/2, 1/2];//multiply r

                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 2]["ballpos"];
                        let pos = rally[rally_seq - 2]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            if (rally[rally_seq-2]["hitplayer"] == this_.playerTop){
                                let r = this_.sma_rect_width/(Math.sqrt(3))
                                let x0 = this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                                let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                                let x1 = this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                                let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];
                                let x2 = this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 
                                let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 ;
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                                //paint a 1/4 fan(direction in light of the stroke position) with downward angle
                            }
                            else {
                                let r = this_.sma_rect_width/(Math.sqrt(3))
                                let x0 = this_.sma_rect_width -(this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos]);
                                let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos];
                                let x1 = this_.sma_rect_width -(this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1]);
                                let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos+1];
                                let x2 = this_.sma_rect_width -(this_.LLFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2); 
                                let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 ;
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;

                                //paint a 1/4 fan(direction in light of the stroke position) with upward angle
                            }
                             
                        }
                        if (rally[rally_seq-2]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r_ = r * 2/3;
                            let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                            let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];

                            let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos];
                            let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                            }

                            //paint a 1/4 fan-sector-short(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let r_ = r * 2/3;
                            let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos];
                            let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos+1];

                            let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos];
                            let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-short(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            if (rally[rally_seq-1]["hitplayer"] == this_.playerTop){
                                let r = this_.sma_rect_width/(Math.sqrt(3))
                                let x0 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                                let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                                let x1 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                                let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];
                                let x2 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 
                                let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 ;
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                                //paint a 1/4 fan(direction in light of the stroke position) with downward angle
                            }
                            else {
                                let r = this_.sma_rect_width/(Math.sqrt(3))
                                let x0 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                                let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos];
                                let x1 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                                let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos+1];
                                let x2 = this_.LFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2; 
                                let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 ;
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x2} ${y2} z`;
                                //paint a 1/4 fan(direction in light of the stroke position) with upward angle
                            }
                             
                        }
                        if (rally[rally_seq-1]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r_ = r * 2/3;
                            let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                            let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];

                            let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos];
                            let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                            }
                            
                            //paint a 1/4 fan-sector-short(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let r_ = r * 2/3;
                            let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos];
                            let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos+1];

                            let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos];
                            let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                            }
                        };
                    }
                    else if (Flow_name == "Flow"){
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            if (rally[rally_seq]["hitplayer"] == this_.playerTop){
                                let r = this_.big_rect_width/(Math.sqrt(3))
                                let x0 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r*x_fc_array[pos];
                                let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                                let x1 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r*x_fc_array[pos+1];
                                let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];
                                let x2 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 
                                let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 ;
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                                //paint a 1/4 fan(direction in light of the stroke position) with downward angle
                            }
                            else {
                                let r = this_.big_rect_width/(Math.sqrt(3))
                                let x0 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r*x_fc_array[pos];
                                let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos];
                                let x1 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r*x_fc_array[pos+1];
                                let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos+1];
                                let x2 = this_.Flow_x0 + 1 * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2; 
                                let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 ;
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                                //paint a 1/4 fan(direction in light of the stroke position) with upward angle
                            }
                             
                        }
                        if (rally[rally_seq]["hitplayer"] == this_.playerTop){
                            let r = this_.big_rect_width/(Math.sqrt(3));
                            let r_ = r * 2/3;
                            let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                            let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];

                            let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r_*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos];
                            let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r_*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-short(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.big_rect_width/(Math.sqrt(3))
                            let r_ = r * 2/3;
                            let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos];
                            let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos+1];

                            let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r_*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos];
                            let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r_*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-short(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            if (rally[rally_seq+1]["hitplayer"] == this_.playerTop){
                                let r = this_.sma_rect_width/(Math.sqrt(3))
                                let x0 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                                let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                                let x1 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                                let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];
                                let x2 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 
                                let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 ;
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                                //paint a 1/4 fan(direction in light of the stroke position) with downward angle
                            }
                            else {
                                let r = this_.sma_rect_width/(Math.sqrt(3))
                                let x0 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                                let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos];
                                let x1 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                                let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos+1];
                                let x2 = this_.RFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2; 
                                let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 ;
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                                //paint a 1/4 fan(direction in light of the stroke position) with upward angle
                            }
                             
                        }
                        if (rally[rally_seq+1]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r_ = r * 2/3;
                            let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                            let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];

                            let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos];
                            let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-short(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let r_ = r * 2/3;
                            let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos];
                            let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos+1];

                            let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos];
                            let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-short(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            if (rally[rally_seq+2]["hitplayer"] == this_.playerTop){
                                let r = this_.sma_rect_width/(Math.sqrt(3))
                                let x0 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                                let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                                let x1 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                                let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];
                                let x2 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 
                                let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 ;
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                                //paint a 1/4 fan(direction in light of the stroke position) with downward angle
                            }
                            else {
                                let r = this_.sma_rect_width/(Math.sqrt(3))
                                let x0 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                                let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos];
                                let x1 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                                let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2+ r*y_ft_or_b_array[pos+1];
                                let x2 = this_.RRFlow_x0 + 1 * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2; 
                                let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 ;
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x2} ${y2} z`;
                                //paint a 1/4 fan(direction in light of the stroke position) with upward angle
                            }
                             
                        }
                        if (rally[rally_seq+2]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r_ = r * 2/3;
                            let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos];
                            let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r*y_ft_or_b_array[pos+1];

                            let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos];
                            let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r_*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r_*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-short(direction in light of the stroke position) with downward angle
                        }
                        else {

                            let r = this_.sma_rect_width/(Math.sqrt(3))
                            let r_ = r * 2/3;
                            let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos];
                            let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r*y_ft_or_b_array[pos+1];

                            let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos];
                            let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r_*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r_*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r_} ${r_} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-short(direction in light of the stroke position) with upward angle
                        };
                    }
                })

            Flow_glyph.append("path")//1/4 fan-sector-middle
                .attr("class", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 2]["ballpos"];
                        let tech = rally[rally_seq - 2]["tech"];
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 1){
                            return "";
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let tech = rally[rally_seq - 1]["tech"];
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 1){
                            return "";
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "Flow"){
                        let ballpos = rally[rally_seq]["ballpos"];
                        let tech = rally[rally_seq]["tech"];
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 1){
                            return "";
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let tech = rally[rally_seq + 1]["tech"];
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 1){
                            return "";
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let tech = rally[rally_seq + 2]["tech"];
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 1){
                            return "";
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                })
                .attr("d", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];
                    let x_fc_array = [Math.sqrt(3)/2, -Math.sqrt(3)/2, -1/2, 0, 1/2, Math.sqrt(3)/2];//multiply r
                    let y_ft_or_b_array = [1/2, 1/2, Math.sqrt(3)/2, 1, Math.sqrt(3)/2, 1/2];//multiply r
                    let fan_sector_gap_big = 2;
                    let fan_sector_gap_sma = 1;
                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 2]["ballpos"];
                        let pos = rally[rally_seq - 2]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            return ""; 
                        }
                        if (ballpos/3 < 1){
                            return "";
                        }
                        if (rally[rally_seq-2]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 2/3 - fan_sector_gap_sma;
                            let r2 = r/3;
                            let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                            let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                            let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 2/3- fan_sector_gap_sma;
                            let r2 = r/3;
                            let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                            let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                            let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 1){
                            return "";
                        }
                        if (rally[rally_seq-1]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 2/3 - fan_sector_gap_sma;
                            let r2 = r/3;
                            let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                            let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                            let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 2/3 - fan_sector_gap_sma;
                            let r2 = r/3;
                            let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                            let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                            let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "Flow"){
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 1){
                            return "";
                        }
                        if (rally[rally_seq]["hitplayer"] == this_.playerTop){
                            let r = this_.big_rect_width/(Math.sqrt(3));
                            let r1 = r * 2/3 - fan_sector_gap_big;
                            let r2 = r/3;
                            let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                            let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                            let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.big_rect_width/(Math.sqrt(3));
                            let r1 = r * 2/3 - fan_sector_gap_big;
                            let r2 = r/3;
                            let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                            let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                            let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 1){
                            return "";
                        }
                        if (rally[rally_seq+1]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 2/3 - fan_sector_gap_sma;
                            let r2 = r/3;
                            let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                            let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                            let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 2/3 - fan_sector_gap_sma;
                            let r2 = r/3;
                            let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                            let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                            let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                           return "";
                        }
                        if (ballpos/3 < 1){
                            return "";
                        }
                        if (rally[rally_seq+2]["hitplayer"] == this_.playerTop){

                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 2/3 - fan_sector_gap_sma;
                            let r2 = r/3;
                            let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                            let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                            let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with downward angle
                        }
                        else {

                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 2/3 - fan_sector_gap_sma;
                            let r2 = r/3;
                            let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                            let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                            let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-middle(direction in light of the stroke position) with upward angle
                        };
                    }
                })

            Flow_glyph.append("path")//1/4 fan-sector-long
                .attr("class", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 2]["ballpos"];
                        let tech = rally[rally_seq - 2]["tech"];
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 2){
                            return "";
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let tech = rally[rally_seq - 1]["tech"];
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 2){
                            return "";
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "Flow"){
                        let ballpos = rally[rally_seq]["ballpos"];
                        let tech = rally[rally_seq]["tech"];
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 2){
                            return "";
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let tech = rally[rally_seq + 1]["tech"];
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 2){
                            return "";
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let tech = rally[rally_seq + 2]["tech"];
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 2){
                            return "";
                        }
                        return `main front_fan_sector tech${tech}`;
                    }
                })
                .attr("d", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];
                    let x_fc_array = [Math.sqrt(3)/2, -Math.sqrt(3)/2, -1/2, 0, 1/2, Math.sqrt(3)/2];//multiply r
                    let y_ft_or_b_array = [1/2, 1/2, Math.sqrt(3)/2, 1, Math.sqrt(3)/2, 1/2];//multiply r
                    let fan_sector_gap_big = 2;
                    let fan_sector_gap_sma = 1;

                    if (Flow_name == "LLFlow"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 2]["ballpos"];
                        let pos = rally[rally_seq - 2]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            return ""; 
                        }
                        if (ballpos/3 < 2){
                            return "";
                        }
                        if (rally[rally_seq-2]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 1/3 - fan_sector_gap_sma;
                            let r2 = 1;
                            let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                            let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                            let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-long(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 1/3 - fan_sector_gap_sma;
                            let r2 = 1;
                            let x0 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                            let x1 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                            let x3 = this_.LLFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-long(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "LFlow"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 2){
                            return "";
                        }
                        if (rally[rally_seq-1]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 1/3 - fan_sector_gap_sma;
                            let r2 = 1;
                            let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                            let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                            let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-long(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 1/3 - fan_sector_gap_sma;
                            let r2 = 1;
                            let x0 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                            let x1 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                            let x3 = this_.LFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-long(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "Flow"){
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 2){
                            return "";
                        }
                        if (rally[rally_seq]["hitplayer"] == this_.playerTop){
                            let r = this_.big_rect_width/(Math.sqrt(3));
                            let r1 = r * 1/3 - fan_sector_gap_big;
                            let r2 = 1;
                            let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                            let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                            let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 + r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-long(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.big_rect_width/(Math.sqrt(3));
                            let r1 = r * 1/3 - fan_sector_gap_big;
                            let r2 = 1;
                            let x0 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                            let x1 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                            let x3 = this_.Flow_x0 + tmp_x * (this_.big_rect_width + this_.big_gap_width) + this_.big_rect_width/2 - r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-long(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "RFlow"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                            return "";
                        }
                        if (ballpos/3 < 2){
                            return "";
                        }
                        if (rally[rally_seq+1]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 1/3 - fan_sector_gap_sma;
                            let r2 = 1;
                            let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                            let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                            let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-long(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 1/3 - fan_sector_gap_sma;
                            let r2 = 1;
                            let x0 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                            let x1 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                            let x3 = this_.RFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-long(direction in light of the stroke position) with upward angle
                        };
                    }
                    else if (Flow_name == "RRFlow"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];
                        let tmp_x = ballpos%3;
                        if (ballpos == -1){
                           return "";
                        }
                        if (ballpos/3 < 2){
                            return "";
                        }
                        if (rally[rally_seq+2]["hitplayer"] == this_.playerTop){
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 1/3 - fan_sector_gap_sma;
                            let r2 = 1;
                            let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos];
                            let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos];
                            let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 + r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 + r/2 - r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-long(direction in light of the stroke position) with downward angle
                        }
                        else {
                            let r = this_.sma_rect_width/(Math.sqrt(3));
                            let r1 = r * 1/3 - fan_sector_gap_sma;
                            let r2 = 1;
                            let x0 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos];
                            let y0 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos];
                            let x1 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r1*x_fc_array[pos+1];
                            let y1 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r1*y_ft_or_b_array[pos+1];

                            let x2 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos];
                            let y2 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos];
                            let x3 = this_.RRFlow_x0 + tmp_x * (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - r2*x_fc_array[pos+1];
                            let y3 = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2 - r/2 + r2*y_ft_or_b_array[pos+1];
                            
                            if(pos == 0){
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 0 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 1 ${x2} ${y2} z`;
                            }
                            else{
                                return `M${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L${x3} ${y3} A ${r2} ${r2} 0 0 0 ${x2} ${y2} z`;
                            }
                            //paint a 1/4 fan-sector-long(direction in light of the stroke position) with upward angle
                        };
                    }
                })
        }

        function WinRate(WinRate_name){
            let WinRate;
            if (WinRate_name == "LLWinRate"){
                WinRate = g.append("g").attr("id", "LLWinRate");
            }
            else if (WinRate_name == "LWinRate"){
                WinRate = g.append("g").attr("id", "LWinRate");
            }
            else if (WinRate_name == "RWinRate"){
                WinRate = g.append("g").attr("id", "RWinRate");
            }
            else if (WinRate_name == "RRWinRate"){
                WinRate = g.append("g").attr("id", "RRWinRate");
            }
            
            let WinRate_rect = WinRate.append("g")
            .attr("id", "back_rect");

            WinRate_rect.append("rect")//left
                .attr("class", `main back_rect normal`)
                .attr("x", function(d,i){//this_可以读取？
                    if (WinRate_name == "LLWinRate"){
                        return this_.LLWinRate_x0;
                    }
                    else if (WinRate_name == "LWinRate"){
                        return this_.LWinRate_x0;
                    }
                    else if (WinRate_name == "RWinRate"){
                        return this_.RWinRate_x0;
                    }
                    else if (WinRate_name == "RRWinRate"){
                        return this_.RRWinRate_x0;
                    }
                })
                .attr("y", function(d,i){
                    return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap;
                })
                .attr("width", function(d,i){
                    return this_.sma_rect_width;
                })
                .attr("height", function(d,i){
                    return this_.rect_height;
                });

            WinRate_rect.append("rect")//middle
                .attr("class", `main back_rect normal`)
                .attr("x", function(d,i){//this_可以读取？
                    if (WinRate_name == "LLWinRate"){
                        return this_.LLWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (WinRate_name == "LWinRate"){
                        return this_.LWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (WinRate_name == "RWinRate"){
                        return this_.RWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (WinRate_name == "RRWinRate"){
                        return this_.RRWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width;
                    }
                })
                .attr("y", function(d,i){
                    return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap;
                })
                .attr("width", function(d,i){
                    return this_.sma_rect_width;
                })
                .attr("height", function(d,i){
                    return this_.rect_height;
                });

            WinRate_rect.append("rect")//right
                .attr("class", `main back_rect normal`)
                .attr("x", function(d,i){//this_可以读取？
                    if (WinRate_name == "LLWinRate"){
                        return this_.LLWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (WinRate_name == "LWinRate"){
                        return this_.LWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (WinRate_name == "RWinRate"){
                        return this_.RWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width + this_.sma_gap_width;
                    }
                    else if (WinRate_name == "RRWinRate"){
                        return this_.RRWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width + this_.sma_gap_width;
                    }
                })
                .attr("y", function(d,i){
                    return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap;
                })
                .attr("width", function(d,i){
                    return this_.sma_rect_width;
                })
                .attr("height", function(d,i){
                    return this_.rect_height;
                });

            let WinRate_back_text = WinRate.append("g")
            .attr("id", "back_text");
            let font_size = 8;

            // WinRate_back_text.append("text")//mid
            //     .attr("class", `main back_text`)
            //     .attr("dx", function(d,i){//
            //         if (WinRate_name == "LLWinRate"){
            //             return this_.LLWinRate_x0 - font_size/2;
            //         }
            //         else if (WinRate_name == "LWinRate"){
            //             return this_.LWinRate_x0 - font_size/2;
            //         }
            //         else if (WinRate_name == "RWinRate"){
            //             return this_.RWinRate_x0 - font_size/2;
            //         }
            //         else if (WinRate_name == "RRWinRate"){
            //             return this_.RRWinRate_x0 - font_size/2;
            //         }
            //     })
            //     .attr("dy", function(d,i){
            //         return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
            //     })
            //     .text("0");



            let WinRate_back_line = WinRate.append("g")
            .attr("id", "back_line");

            WinRate_back_line.append("line")
                .attr("class", `main back_line`)
                .attr("x1", function(d,i){//this_可以读取？
                    if (WinRate_name == "LLWinRate"){
                        return this_.LLWinRate_x0;
                    }
                    else if (WinRate_name == "LWinRate"){
                        return this_.LWinRate_x0;
                    }
                    else if (WinRate_name == "RWinRate"){
                        return this_.RWinRate_x0;
                    }
                    else if (WinRate_name == "RRWinRate"){
                        return this_.RRWinRate_x0;
                    }
                })
                .attr("y1", function(d,i){
                    return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                })
                .attr("x2", function(d,i){//this_可以读取？
                    if (WinRate_name == "LLWinRate"){
                        return this_.LLWinRate_x0 + this_.sma_rect_width*3 + this_.sma_gap_width*2;
                    }
                    else if (WinRate_name == "LWinRate"){
                        return this_.LWinRate_x0 + this_.sma_rect_width*3 + this_.sma_gap_width*2;
                    }
                    else if (WinRate_name == "RWinRate"){
                        return this_.RWinRate_x0 + this_.sma_rect_width*3 + this_.sma_gap_width*2;
                    }
                    else if (WinRate_name == "RRWinRate"){
                        return this_.RRWinRate_x0 + this_.sma_rect_width*3 + this_.sma_gap_width*2;
                    }
                })
                .attr("y2", function(d,i){
                    return i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height/2;
                })
                .attr("stroke-dasharray","10,5");

            let WinRate_fron = WinRate.append("g")
            .attr("id", "fron");

            // WinRate_fron.append("path")
                //     .attr("class", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"]
                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 < 0){
                //                 return "";
                //             }
                //             return `score front_line player${rally[rally_seq-1]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 < 0){
                //                 return "";
                //             }
                //             return `score front_line player${rally[rally_seq]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                //             return `score front_line player${rally[rally_seq+1]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                //             return `score front_line player${rally[rally_seq+2]["hitplayer"]}`
                //         }
                //     })
                //     .attr("d", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"];
                        
                //         let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height *0.9,
                //             y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height *0.1;
                //         let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                //             y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                //             y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                //             y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;

                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 <  0){
                //                 return "";
                //             }
                //             let x0 = this_.LLWinRate_x0 + this_.sma_rect_width/2,
                //             x1 = this_.LLWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2,
                //             x2 = this_.LLWinRate_x0 + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2;
                            
                //             let tech = rally[rally_seq - 1]["tech"];
                //             let ballpos = rally[rally_seq - 1]["ballpos"];
                //             let pos = rally[rally_seq - 1]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }

                //             let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             if (ballpos == -1){
                //                 return `M ${x0} ${scale(y0)} L ${x2} ${scale(y2)}`
                //             }
                //             return `M ${x0} ${scale(y0)} L ${x1} ${scale(y1)} L ${x2} ${scale(y2)}`;
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 <  0){
                //                 return "";
                //             }
                //             let x0 = this_.LWinRate_x0 + this_.sma_rect_width/2,
                //             x1 = this_.LWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2,
                //             x2 = this_.LWinRate_x0 + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2;
                            
                //             let tech = rally[rally_seq]["tech"];
                //             let ballpos = rally[rally_seq]["ballpos"];
                //             let pos = rally[rally_seq]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             if (ballpos == -1){
                //                 return `M ${x0} ${scale(y0)} L ${x2} ${scale(y2)}`
                //             }
                //             return `M ${x0} ${scale(y0)} L ${x1} ${scale(y1)} L ${x2} ${scale(y2)}`;
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                //             let x0 = this_.RWinRate_x0 + this_.sma_rect_width/2,
                //             x1 = this_.RWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2,
                //             x2 = this_.RWinRate_x0 + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2;
                            
                //             let tech = rally[rally_seq + 1]["tech"];
                //             let ballpos = rally[rally_seq + 1]["ballpos"];
                //             let pos = rally[rally_seq + 1]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}


                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);

                //             if (ballpos == -1){
                //                 return `M ${x0} ${scale(y0)} L ${x2} ${scale(y2)}`
                //             }
                //             return `M ${x0} ${scale(y0)} L ${x1} ${scale(y1)} L ${x2} ${scale(y2)}`;
                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                //             let x0 = this_.RRWinRate_x0 + this_.sma_rect_width/2,
                //             x1 = this_.RRWinRate_x0 + this_.sma_rect_width + this_.sma_gap_width + this_.sma_rect_width/2,
                //             x2 = this_.RRWinRate_x0 + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2;
                            
                //             let tech = rally[rally_seq + 2]["tech"];
                //             let ballpos = rally[rally_seq + 2]["ballpos"];
                //             let pos = rally[rally_seq + 2]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             if (ballpos == -1){
                //                 return `M ${x0} ${scale(y0)} L ${x2} ${scale(y2)}`
                //             }                
                //             return `M ${x0} ${scale(y0)} L ${x1} ${scale(y1)} L ${x2} ${scale(y2)}`;
                //         } 
                //     });
            let width_bar = 10;
            WinRate_fron.append("rect")//left
                .attr("class", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;
                    
                    let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                        y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                        y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;
                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        let tech = rally[rally_seq - 1]["tech"];
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }

                        let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return `score front_point player${rally[rally_seq-1]["hitplayer"]}${scale(y0)}`;
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                         let tech = rally[rally_seq]["tech"];
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                                // return scale_neg(value);
                            }

                        }
                        return `score front_point player${rally[rally_seq]["hitplayer"]}${scale(y0)}`
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let tech = rally[rally_seq + 1]["tech"];
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                                // return scale_neg(value);
                            }

                        }
                        return `score front_point player${rally[rally_seq+1]["hitplayer"]}${scale(y0)}`
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let tech = rally[rally_seq + 2]["tech"];
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                                // return scale_neg(value);
                            }

                        }
                        return `score front_point player${rally[rally_seq+2]["hitplayer"]}${scale(y0)}`
                    }
                })
                .attr("x", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];
                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        return this_.LLWinRate_x0 + this_.sma_rect_width/2 - width_bar/2;
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        return this_.LWinRate_x0 + this_.sma_rect_width/2 - width_bar/2;
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        return this_.RWinRate_x0 + this_.sma_rect_width/2 - width_bar/2;
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        return this_.RRWinRate_x0 + this_.sma_rect_width/2 - width_bar/2;
                    }
                })
                .attr("y", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;
                    
                    let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                        y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                        y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;

                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq - 1]["tech"];
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }

                        let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y0);
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq]["tech"];
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y0);
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 1]["tech"];
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y0);

                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 2]["tech"];
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y0);
                    } 
                })
                .attr("width", width_bar)
                .attr("height",function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                    let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                        y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                        y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;


                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq - 1]["tech"];
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }

                        let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y0);
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq]["tech"];
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y0);
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 1]["tech"];
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y0);

                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 2]["tech"];
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y0);
                    } 
                } )
                .attr("visibility", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 <  0){
                            return "hidden";
                        }
                        return "visible";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 <  0){
                            return "hidden";
                        }
                        return "visible";
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "hidden";
                        }
                       
                        return "visible";

                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "hidden";
                        }
                        
                        return "visible";
                    } 
                });
            // WinRate_fron.append("circle")//left
                //     .attr("class", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"]
                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 < 0){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq-1]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 < 0){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq+1]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq+2]["hitplayer"]}`
                //         }
                //     })
                //     .attr("cx", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"];
                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 < 0){
                //                 return "";
                //             }
                //             return this_.LLWinRate_x0 + this_.sma_rect_width/2;
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 < 0){
                //                 return "";
                //             }
                //             return this_.LWinRate_x0 + this_.sma_rect_width/2;
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                //             return this_.RWinRate_x0 + this_.sma_rect_width/2;
                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                //             return this_.RRWinRate_x0 + this_.sma_rect_width/2;
                //         }
                //     })
                //     .attr("cy", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"];

                //         let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                //             y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                //         let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                //             y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                //             y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                //             y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;


                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 <  0){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq - 1]["tech"];
                //             let ballpos = rally[rally_seq - 1]["ballpos"];
                //             let pos = rally[rally_seq - 1]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }

                //             let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             return scale(y0);
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 <  0){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq]["tech"];
                //             let ballpos = rally[rally_seq]["ballpos"];
                //             let pos = rally[rally_seq]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             return scale(y0);
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq + 1]["tech"];
                //             let ballpos = rally[rally_seq + 1]["ballpos"];
                //             let pos = rally[rally_seq + 1]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             return scale(y0);

                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq + 2]["tech"];
                //             let ballpos = rally[rally_seq + 2]["ballpos"];
                //             let pos = rally[rally_seq + 2]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             return scale(y0);
                //         } 
                //     })
                //     .attr("r", this_.score_r)
                //     .attr("visibility", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"];

                //         let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                //             y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 <  0){
                //                 return "hidden";
                //             }
                //             return "visible";
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 <  0){
                //                 return "hidden";
                //             }
                //             return "visible";
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "hidden";
                //             }
                           
                //             return "visible";

                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "hidden";
                //             }
                            
                //             return "visible";
                //         } 
                //     });
            WinRate_fron.append("rect")//middle
                .attr("class", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];
                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                    let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                        y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                        y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;

                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }

                        let tech = rally[rally_seq - 1]["tech"];
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }

                        let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                            }

                        }
                        return `score front_point player${rally[rally_seq-1]["hitplayer"]}${scale(y1)}`
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                         let tech = rally[rally_seq]["tech"];
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                            }

                        }
                        return `score front_point player${rally[rally_seq]["hitplayer"]}${scale(y1)}`
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let tech = rally[rally_seq + 1]["tech"];
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                            }

                        }
                        return `score front_point player${rally[rally_seq+1]["hitplayer"]}${scale(y1)}`
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let tech = rally[rally_seq + 2]["tech"];
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                            }

                        }
                        return `score front_point player${rally[rally_seq+2]["hitplayer"]}${scale(y1)}`
                    }
                })
                .attr("x", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];
                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        return this_.LLWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - width_bar/2;
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        return this_.LWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - width_bar/2;
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        return this_.RWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - width_bar/2;
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        return this_.RRWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2 - width_bar/2;
                    }
                })
                .attr("y", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                    let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                        y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                        y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;


                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq - 1]["tech"];
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }

                        let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        if(ballpos != -1){
                            return scale(y1);
                        }
                        return "";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq]["tech"];
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        if(ballpos != -1){
                            return scale(y1);
                        }
                        return "";
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 1]["tech"];
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        if(ballpos != -1){
                            return scale(y1);
                        }
                        return "";

                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 2]["tech"];
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        if(ballpos != -1){
                            return scale(y1);
                        }
                        return "";
                    } 
                })
                .attr("width", width_bar)
                .attr("height", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                    let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                        y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                        y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;


                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq - 1]["tech"];
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }

                        let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        if(ballpos != -1){
                            return scale(y1);
                        }
                        return "";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq]["tech"];
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        if(ballpos != -1){
                            return scale(y1);
                        }
                        return "";
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 1]["tech"];
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        if(ballpos != -1){
                            return scale(y1);
                        }
                        return "";

                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 2]["tech"];
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        if(ballpos != -1){
                            return scale(y1);
                        }
                        return "";
                    } 
                })
                .attr("visibility", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 <  0){
                            return "hidden";
                        }
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        
                        if(ballpos != -1){
                            return "visible";
                        }
                        return "hidden";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 <  0){
                            return "hidden";
                        }
                        
                        let ballpos = rally[rally_seq]["ballpos"];

                       if(ballpos != -1){
                            return "visible";
                        }
                        return "hidden";
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "hidden";
                        }
                        
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        

                        if(ballpos != -1){
                            return "visible";
                        }
                        return "hidden";

                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "hidden";
                        }
                        
                        let ballpos = rally[rally_seq + 2]["ballpos"];

                        if(ballpos != -1){
                            return "visible";
                        }
                        return "hidden";
                    } 
                });
            // WinRate_fron.append("circle")//middle
                //     .attr("class", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"]
                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 < 0){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq-1]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 < 0){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq+1]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq+2]["hitplayer"]}`
                //         }
                //     })
                //     .attr("cx", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"];
                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 < 0){
                //                 return "";
                //             }
                //             return this_.LLWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 < 0){
                //                 return "";
                //             }
                //             return this_.LWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                //             return this_.RWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                //             return this_.RRWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width) + this_.sma_rect_width/2;
                //         }
                //     })
                //     .attr("cy", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"];

                //         let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                //             y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                //         let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                //             y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                //             y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                //             y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;


                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 <  0){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq - 1]["tech"];
                //             let ballpos = rally[rally_seq - 1]["ballpos"];
                //             let pos = rally[rally_seq - 1]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }

                //             let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             if(ballpos != -1){
                //                 return scale(y1);
                //             }
                //             return "";
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 <  0){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq]["tech"];
                //             let ballpos = rally[rally_seq]["ballpos"];
                //             let pos = rally[rally_seq]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             if(ballpos != -1){
                //                 return scale(y1);
                //             }
                //             return "";
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq + 1]["tech"];
                //             let ballpos = rally[rally_seq + 1]["ballpos"];
                //             let pos = rally[rally_seq + 1]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             if(ballpos != -1){
                //                 return scale(y1);
                //             }
                //             return "";

                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq + 2]["tech"];
                //             let ballpos = rally[rally_seq + 2]["ballpos"];
                //             let pos = rally[rally_seq + 2]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             if(ballpos != -1){
                //                 return scale(y1);
                //             }
                //             return "";
                //         } 
                //     })
                //     .attr("r", this_.score_r)
                //     .attr("visibility", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"];

                //         let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                //             y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 <  0){
                //                 return "hidden";
                //             }
                //             let ballpos = rally[rally_seq - 1]["ballpos"];
                            
                //             if(ballpos != -1){
                //                 return "visible";
                //             }
                //             return "hidden";
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 <  0){
                //                 return "hidden";
                //             }
                            
                //             let ballpos = rally[rally_seq]["ballpos"];

                //            if(ballpos != -1){
                //                 return "visible";
                //             }
                //             return "hidden";
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "hidden";
                //             }
                            
                //             let ballpos = rally[rally_seq + 1]["ballpos"];
                            

                //             if(ballpos != -1){
                //                 return "visible";
                //             }
                //             return "hidden";

                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "hidden";
                //             }
                            
                //             let ballpos = rally[rally_seq + 2]["ballpos"];

                //             if(ballpos != -1){
                //                 return "visible";
                //             }
                //             return "hidden";
                //         } 
                //     });
            WinRate_fron.append("rect")//right
                .attr("class", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                    let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                        y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                        y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;

                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        let tech = rally[rally_seq - 1]["tech"];
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }

                        let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                                // return scale_neg(value);
                            }

                        }

                        return `score front_point player${rally[rally_seq-1]["hitplayer"]}${scale(y2)}`
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                         let tech = rally[rally_seq]["tech"];
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                                // return scale_neg(value);
                            }

                        }
                        return `score front_point player${rally[rally_seq]["hitplayer"]}${scale(y2)}`
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        let tech = rally[rally_seq + 1]["tech"];
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                                // return scale_neg(value);
                            }

                        }
                        return `score front_point player${rally[rally_seq+1]["hitplayer"]}${scale(y2)}`
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        let tech = rally[rally_seq + 2]["tech"];
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return "";
                            }
                            else{
                                return "_neg";
                                // return scale_neg(value);
                            }

                        }
                        return `score front_point player${rally[rally_seq+2]["hitplayer"]}${scale(y2)}`
                    }
                })
                .attr("x", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];
                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 < 0){
                            return "";
                        }
                        return this_.LLWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2 - width_bar/2;
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 < 0){
                            return "";
                        }
                        return this_.LWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2 - width_bar/2;
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        return this_.RWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2 - width_bar/2;
                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        return this_.RRWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2 - width_bar/2;
                    }
                })
                .attr("y", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                    let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                        y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                        y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;

                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq - 1]["tech"];
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }

                        let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }

                        return scale(y2);
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq]["tech"];
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y2);
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 1]["tech"];
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y2);

                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 2]["tech"];
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return scale_pos(value);
                            }
                            else{
                                return y_max_neg;
                                // return scale_neg(value);
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y2);
                    } 
                })
                .attr("width", width_bar)
                .attr("height", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                    let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                        y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                        y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;

                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq - 1]["tech"];
                        let ballpos = rally[rally_seq - 1]["ballpos"];
                        let pos = rally[rally_seq - 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }

                        let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }

                        return scale(y2);
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 <  0){
                            return "";
                        }
                        
                        let tech = rally[rally_seq]["tech"];
                        let ballpos = rally[rally_seq]["ballpos"];
                        let pos = rally[rally_seq]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y2);
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 1]["tech"];
                        let ballpos = rally[rally_seq + 1]["ballpos"];
                        let pos = rally[rally_seq + 1]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y2);

                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "";
                        }
                        
                        let tech = rally[rally_seq + 2]["tech"];
                        let ballpos = rally[rally_seq + 2]["ballpos"];
                        let pos = rally[rally_seq + 2]["pos"];

                        let min = 1, max = -1;
                        let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                        if (min > y0){min = y0}
                        if (max < y0){max = y0}
                        
                        let y1;
                        if (ballpos != -1){
                            y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                            if (min > y1){min = y1}
                            if (max < y1){max = y1}
                        }
                    
                        let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                        if (min > y2){min = y2}
                        if (max < y2){max = y2}

                        let pos_max = 0,
                            pos_min = 0,
                            neg_max = 0,
                            neg_min = 0;
                        if(max > 0){
                            pos_max = max;
                        }
                        if(min < 0){
                            pos_min = min;
                        }
                        
                        let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_pos, y_max_pos]),
                            scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                                                     .range([y_min_neg, y_max_neg]);
                        function scale(value){
                            if(value > 0){
                                return y_min_pos - scale_pos(value);
                            }
                            else{
                                return scale_neg(value) - y_max_neg;
                            }

                        }
                        // let scale = d3.scaleLinear().domain([min, max])
                        //                              .range([y_min, y_max]);
                        return scale(y2);
                    } 
                })
                .attr("visibility", function(d,i){
                    let rally_seq = d["stroke_context"]["rally_seq"];
                    let rally = d["stroke_context"]["rally"];

                    let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                        y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                    if (WinRate_name == "LLWinRate"){
                        if (rally_seq - 2 <  0){
                            return "hidden";
                        }
                        return "visible";
                    }
                    else if (WinRate_name == "LWinRate"){
                        if (rally_seq - 1 <  0){
                            return "hidden";
                        }
                        return "visible";
                    }
                    else if (WinRate_name == "RWinRate"){
                        if (rally_seq + 1 >=  rally.length){
                            return "hidden";
                        }
                       
                        return "visible";

                    }
                    else if (WinRate_name == "RRWinRate"){
                        if (rally_seq + 2 >=  rally.length){
                            return "hidden";
                        }
                        
                        return "visible";
                    } 
                });
            // WinRate_fron.append("circle")//right
                //     .attr("class", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"]
                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 < 0){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq-1]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 < 0){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq+1]["hitplayer"]}`
                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                //             return `score front_point player${rally[rally_seq+2]["hitplayer"]}`
                //         }
                //     })
                //     .attr("cx", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"];
                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 < 0){
                //                 return "";
                //             }
                //             return this_.LLWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2;
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 < 0){
                //                 return "";
                //             }
                //             return this_.LWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2;
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                //             return this_.RWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2;
                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                //             return this_.RRWinRate_x0  + (this_.sma_rect_width + this_.sma_gap_width)*2 + this_.sma_rect_width/2;
                //         }
                //     })
                //     .attr("cy", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"];

                //         let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                //             y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                //         let y_min_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5,
                //             y_max_pos = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1,

                //             y_min_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                //             y_max_neg = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.5;

                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 <  0){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq - 1]["tech"];
                //             let ballpos = rally[rally_seq - 1]["ballpos"];
                //             let pos = rally[rally_seq - 1]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq - 1]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq - 1]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }

                //             let y2 = rally[rally_seq - 1]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }

                //             return scale(y2);
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 <  0){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq]["tech"];
                //             let ballpos = rally[rally_seq]["ballpos"];
                //             let pos = rally[rally_seq]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             return scale(y2);
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq + 1]["tech"];
                //             let ballpos = rally[rally_seq + 1]["ballpos"];
                //             let pos = rally[rally_seq + 1]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq + 1]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq + 1]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq + 1]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             return scale(y2);

                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "";
                //             }
                            
                //             let tech = rally[rally_seq + 2]["tech"];
                //             let ballpos = rally[rally_seq + 2]["ballpos"];
                //             let pos = rally[rally_seq + 2]["pos"];

                //             let min = 1, max = -1;
                //             let y0 = rally[rally_seq + 2]["winning_rate"]["tech"][tech];
                //             if (min > y0){min = y0}
                //             if (max < y0){max = y0}
                            
                //             let y1;
                //             if (ballpos != -1){
                //                 y1 = rally[rally_seq + 2]["winning_rate"]["ballpos"][ballpos];
                //                 if (min > y1){min = y1}
                //                 if (max < y1){max = y1}
                //             }
                        
                //             let y2 = rally[rally_seq + 2]["winning_rate"]["pos"][pos];
                //             if (min > y2){min = y2}
                //             if (max < y2){max = y2}

                //             let pos_max = 0,
                //                 pos_min = 0,
                //                 neg_max = 0,
                //                 neg_min = 0;
                //             if(max > 0){
                //                 pos_max = max;
                //             }
                //             if(min < 0){
                //                 pos_min = min;
                //             }
                            
                //             let scale_pos = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_pos, y_max_pos]),
                //                 scale_neg = d3.scaleLinear().domain([pos_min, pos_max])
                //                                          .range([y_min_neg, y_max_neg]);
                //             function scale(value){
                //                 if(value > 0){
                //                     return scale_pos(value);
                //                 }
                //                 else{
                //                     return scale_neg(value);
                //                 }

                //             }
                //             // let scale = d3.scaleLinear().domain([min, max])
                //             //                              .range([y_min, y_max]);
                //             return scale(y2);
                //         } 
                //     })
                //     .attr("r", this_.score_r)
                //     .attr("visibility", function(d,i){
                //         let rally_seq = d["stroke_context"]["rally_seq"];
                //         let rally = d["stroke_context"]["rally"];

                //         let y_min = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.9,
                //             y_max = i*(this_.rect_height + this_.sma_gap_height) + this_.top_gap + this_.rect_height * 0.1;

                //         if (WinRate_name == "LLWinRate"){
                //             if (rally_seq - 2 <  0){
                //                 return "hidden";
                //             }
                //             return "visible";
                //         }
                //         else if (WinRate_name == "LWinRate"){
                //             if (rally_seq - 1 <  0){
                //                 return "hidden";
                //             }
                //             return "visible";
                //         }
                //         else if (WinRate_name == "RWinRate"){
                //             if (rally_seq + 1 >=  rally.length){
                //                 return "hidden";
                //             }
                           
                //             return "visible";

                //         }
                //         else if (WinRate_name == "RRWinRate"){
                //             if (rally_seq + 2 >=  rally.length){
                //                 return "hidden";
                //             }
                            
                //             return "visible";
                //         } 
                //     });

            
        }

        Flow("LLFlow");
        Flow("LFlow");
        Flow("Flow");
        Flow("RFlow");
        Flow("RRFlow");
        
        WinRate("LLWinRate");
        WinRate("LWinRate");
        WinRate("RWinRate");
        WinRate("RRWinRate");
    }
}