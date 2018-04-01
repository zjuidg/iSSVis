class mainMenu {
    constructor() {
        this.div = d3.select("#MIDDLE");
        this.svg_menu_bottom = this.div.append("svg").attr("id", "svg_menu_bottom");
        
        this.svg_menu_width = parseInt(this.svg_menu_bottom.style("width").split("p")[0]);
        this.svg_menu_bottom_height = parseInt(this.svg_menu_bottom.style("height").split("p")[0]);
        this.bottom_side_width;

        
        this.paint_bottom();

    }
    initial(){
        // let this_ = this;
        // this_.svg_menu_top.selectAll("g#tactic_left").selectAll("rect#back").attr("class", "menu back_switch_button normal")
        // this_.svg_menu_top.selectAll("g#tactic_left").selectAll("rect#fron").attr("class", "menu fron_switch_button normal")
        // this_.svg_menu_top.selectAll("g#tactic_middle").selectAll("rect#back").attr("class", "menu back_switch_button selected")
        // this_.svg_menu_top.selectAll("g#tactic_middle").selectAll("rect#fron").attr("class", "menu fron_switch_button selected")
        // this_.svg_menu_top.selectAll("g#tactic_right").selectAll("rect#back").attr("class", "menu back_switch_button normal")
        // this_.svg_menu_top.selectAll("g#tactic_right").selectAll("rect#fron").attr("class", "menu fron_switch_button normal")
    }
    paint_top(){
        let this_ = this;

        let switch_button = this_.svg_menu_top.append("g")
        .attr("id", "switch_button");

        let top = switch_button.append("g").attr("id", "tactic_left")
        .on("click", function(d,i){
            this_.svg_menu_top.selectAll("g#tactic_left").selectAll("rect#back").attr("class", "menu back_switch_button selected")
            this_.svg_menu_top.selectAll("g#tactic_left").selectAll("rect#fron").attr("class", "menu fron_switch_button selected")
            this_.svg_menu_top.selectAll("g#tactic_middle").selectAll("rect#back").attr("class", "menu back_switch_button normal")
            this_.svg_menu_top.selectAll("g#tactic_middle").selectAll("rect#fron").attr("class", "menu fron_switch_button normal")
            this_.svg_menu_top.selectAll("g#tactic_right").selectAll("rect#back").attr("class", "menu back_switch_button normal")
            this_.svg_menu_top.selectAll("g#tactic_right").selectAll("rect#fron").attr("class", "menu fron_switch_button normal")

            // let translate_y;
            // translate_y = timeline.svg_main_g.attr("transform");
            // if(translate_y == null){
            //     translate_y = 0;
            // }
            // else{
            //     translate_y = parseFloat(translate_y.split(",")[1].split(")")[0]);
                
            // }
            timeline.svg_main.selectAll("g#svg_main_g")
            .transition('position')
            .duration(750)
            .attr("transform", `translate(${-timeline.svg_main_move_width},${0})`);

            TOP.svg_table_g
            .transition('position')
            .duration(750)
            .attr("transform", `translate(${-timeline.svg_main_move_width},${0})`);


        });

        let mid = switch_button.append("g").attr("id", "tactic_middle")
        .on("click", function(d,i){
            this_.svg_menu_top.selectAll("g#tactic_left").selectAll("rect#back").attr("class", "menu back_switch_button normal")
            this_.svg_menu_top.selectAll("g#tactic_left").selectAll("rect#fron").attr("class", "menu fron_switch_button normal")
            this_.svg_menu_top.selectAll("g#tactic_middle").selectAll("rect#back").attr("class", "menu back_switch_button selected")
            this_.svg_menu_top.selectAll("g#tactic_middle").selectAll("rect#fron").attr("class", "menu fron_switch_button selected")
            this_.svg_menu_top.selectAll("g#tactic_right").selectAll("rect#back").attr("class", "menu back_switch_button normal")
            this_.svg_menu_top.selectAll("g#tactic_right").selectAll("rect#fron").attr("class", "menu fron_switch_button normal")

            // let translate_y;
            // translate_y = timeline.svg_main_g.attr("transform");
            // if(translate_y == null){
            //     translate_y = 0;
            // }
            // else{
            //     translate_y = parseFloat(translate_y.split(",")[1].split(")")[0]);
                
            // }
            timeline.svg_main.selectAll("g#svg_main_g")
            .transition('position')
            .duration(750)
            .attr("transform", `translate(${0},${0})`);

            TOP.svg_table_g
            .transition('position')
            .duration(750)
            .attr("transform", `translate(${0},${0})`);
        });

        let bot = switch_button.append("g").attr("id", "tactic_right")
        .on("click", function(d,i){
            this_.svg_menu_top.selectAll("g#tactic_left").selectAll("rect#back").attr("class", "menu back_switch_button normal")
            this_.svg_menu_top.selectAll("g#tactic_left").selectAll("rect#fron").attr("class", "menu fron_switch_button normal")
            this_.svg_menu_top.selectAll("g#tactic_middle").selectAll("rect#back").attr("class", "menu back_switch_button normal")
            this_.svg_menu_top.selectAll("g#tactic_middle").selectAll("rect#fron").attr("class", "menu fron_switch_button normal")
            this_.svg_menu_top.selectAll("g#tactic_right").selectAll("rect#back").attr("class", "menu back_switch_button selected")
            this_.svg_menu_top.selectAll("g#tactic_right").selectAll("rect#fron").attr("class", "menu fron_switch_button selected")

            // let translate_y;
            // translate_y = timeline.svg_main_g.attr("transform");
            // if(translate_y == null){
            //     translate_y = 0;
            // }
            // else{
            //     translate_y = parseFloat(translate_y.split(",")[1].split(")")[0]);
                
            // }
            timeline.svg_main.selectAll("g#svg_main_g")
            .transition('position')
            .duration(750)
            .attr("transform", `translate(${timeline.svg_main_move_width},${0})`);

            TOP.svg_table_g
            .transition('position')
            .duration(750)
            .attr("transform", `translate(${timeline.svg_main_move_width},${0})`);
        });

        top.append("rect").attr("id", "back")
        .attr("class", "menu back_switch_button normal")
        .attr("x", 0)
        .attr("y", this_.switch_button_y0)
        .attr("width", this_.svg_menu_width)
        .attr("height", this_.switch_button_height_back)
        top.append("rect").attr("id", "fron")
        .attr("class", "menu fron_switch_button normal")
        .attr("x", this_.switch_button_edge)
        .attr("y", this_.switch_button_y0 + this_.switch_button_height_back - this_.switch_button_bto_dis - this_.switch_button_side_big)
        .attr("width", this_.switch_button_side_big)
        .attr("height", this_.switch_button_side_big)
        .attr("rx", this.switch_button_rx_y)
        .attr("ry", this.switch_button_rx_y);
        top.append("rect").attr("id", "fron")
        .attr("class", "menu fron_switch_button normal")
        .attr("x", this_.switch_button_edge + this_.switch_button_side_big + this_.switch_button_gap)
        .attr("y", this_.switch_button_y0 + this_.switch_button_height_back - this_.switch_button_bto_dis - this_.switch_button_side_sma)
        .attr("width", this_.switch_button_side_sma)
        .attr("height", this_.switch_button_side_sma)
        .attr("rx", this.switch_button_rx_y)
        .attr("ry", this.switch_button_rx_y);
        top.append("rect").attr("id", "fron")
        .attr("class", "menu fron_switch_button normal")
        .attr("x", this_.switch_button_edge+ this_.switch_button_side_big + this_.switch_button_gap + this_.switch_button_side_sma + this_.switch_button_gap)
        .attr("y", this_.switch_button_y0 + this_.switch_button_height_back - this_.switch_button_bto_dis - this_.switch_button_side_sma)
        .attr("width", this_.switch_button_side_sma)
        .attr("height", this_.switch_button_side_sma)
        .attr("rx", this.switch_button_rx_y)
        .attr("ry", this.switch_button_rx_y);



        mid.append("rect").attr("id", "back")
        .attr("class", "menu back_switch_button selected")
        .attr("x", 0)
        .attr("y", this_.switch_button_y0 + this_.switch_button_height_back + this_.switch_button_gap)
        .attr("width", this_.svg_menu_width)
        .attr("height", this_.switch_button_height_back);
        mid.append("rect").attr("id", "fron")
        .attr("class", "menu fron_switch_button selected")
        .attr("x", this_.switch_button_edge)
        .attr("y", this_.switch_button_y0 + this_.switch_button_height_back - this_.switch_button_bto_dis - this_.switch_button_side_sma + this_.switch_button_height_back)
        .attr("width", this_.switch_button_side_sma)
        .attr("height", this_.switch_button_side_sma)
        .attr("rx", this.switch_button_rx_y)
        .attr("ry", this.switch_button_rx_y);
        mid.append("rect").attr("id", "fron")
        .attr("class", "menu fron_switch_button selected")
        .attr("x", this_.switch_button_edge + this_.switch_button_side_sma + this_.switch_button_gap)
        .attr("y", this_.switch_button_y0 + this_.switch_button_height_back - this_.switch_button_bto_dis - this_.switch_button_side_big + this_.switch_button_height_back)
        .attr("width", this_.switch_button_side_big)
        .attr("height", this_.switch_button_side_big)
        .attr("rx", this.switch_button_rx_y)
        .attr("ry", this.switch_button_rx_y);
        mid.append("rect").attr("id", "fron")
        .attr("class", "menu fron_switch_button selected")
        .attr("x", this_.switch_button_edge+ this_.switch_button_side_big + this_.switch_button_gap + this_.switch_button_side_sma + this_.switch_button_gap)
        .attr("y", this_.switch_button_y0 + this_.switch_button_height_back - this_.switch_button_bto_dis - this_.switch_button_side_sma + this_.switch_button_height_back)
        .attr("width", this_.switch_button_side_sma)
        .attr("height", this_.switch_button_side_sma)
        .attr("rx", this.switch_button_rx_y)
        .attr("ry", this.switch_button_rx_y);

        bot.append("rect").attr("id", "back")
        .attr("class", "menu back_switch_button normal")
        .attr("x", 0)
        .attr("y", this_.switch_button_y0 + (this_.switch_button_height_back + this_.switch_button_gap)*2 )
        .attr("width", this_.svg_menu_width)
        .attr("height", this_.switch_button_height_back);
        bot.append("rect").attr("id", "fron")
        .attr("class", "menu fron_switch_button normal")
        .attr("x", this_.switch_button_edge)
        .attr("y", this_.switch_button_y0 + this_.switch_button_height_back - this_.switch_button_bto_dis - this_.switch_button_side_sma + this_.switch_button_height_back*2)
        .attr("width", this_.switch_button_side_sma)
        .attr("height", this_.switch_button_side_sma)
        .attr("rx", this.switch_button_rx_y)
        .attr("ry", this.switch_button_rx_y);
        bot.append("rect").attr("id", "fron")
        .attr("class", "menu fron_switch_button normal")
        .attr("x", this_.switch_button_edge + this_.switch_button_side_sma + this_.switch_button_gap)
        .attr("y", this_.switch_button_y0 + this_.switch_button_height_back - this_.switch_button_bto_dis - this_.switch_button_side_sma + this_.switch_button_height_back*2)
        .attr("width", this_.switch_button_side_sma)
        .attr("height", this_.switch_button_side_sma)
        .attr("rx", this.switch_button_rx_y)
        .attr("ry", this.switch_button_rx_y);
        bot.append("rect").attr("id", "fron")
        .attr("class", "menu fron_switch_button normal")
        .attr("x", this_.switch_button_edge+ this_.switch_button_side_sma + this_.switch_button_gap + this_.switch_button_side_sma + this_.switch_button_gap)
        .attr("y", this_.switch_button_y0 + this_.switch_button_height_back - this_.switch_button_bto_dis - this_.switch_button_side_big + this_.switch_button_height_back*2)
        .attr("width", this_.switch_button_side_big)
        .attr("height", this_.switch_button_side_big)
        .attr("rx", this.switch_button_rx_y)
        .attr("ry", this.switch_button_rx_y);
    }

    paint_bottom(){
        let this_ = this;
        // console.log(this.svg_menu_width);
        let y0 = 5;
        let rect_side = 20/163*this.svg_menu_width,
            rect_r = 5/163*this.svg_menu_width,
            rect_gap = 10/163*this.svg_menu_width,
            middle_gap = 46/163*this.svg_menu_width,
            top_gap = 0/163*this.svg_menu_width,
            move_y = 50,
            rect_left_x = rect_side,
            rect_right_x = rect_left_x + rect_side + middle_gap,
            rect_left_y = y0 + this_.svg_menu_bottom_height/2 + top_gap - move_y,
            rect_right_y =  rect_left_y + 10;

        let left_gap = 5,
            bottom_gap = 5,
            title_height = 30,
            r_left = 5,
            font_size = 27.25 *0.6;

        let trian_height = 0.155*2*this_.svg_menu_bottom_height;
        let back_width = this_.svg_menu_width;
        

        let w1 = parseInt(this.div.style("width").split("p")[0]),
            w2 = parseInt(this.svg_menu_bottom.style("width").split("p")[0]);
        console.log(w1, w2)

        this_.svg_menu_bottom
        .append("svg:path")
        .attr("class", "menu back_rect")
        .attr("d", function (d,i){
            return `M ${0} ${trian_height} L ${back_width} ${0} L ${back_width} ${this_.svg_menu_bottom_height} L ${0} ${this_.svg_menu_bottom_height} z`
        })
        
        let move = trian_height/5;
        this_.svg_menu_bottom
        .append("svg:path")
        .attr("class", "top back_rect")
        .attr("d", function (d,i){
            return `M ${back_width *4/5} ${trian_height/5 + move} L ${back_width} ${0 + move} L ${back_width} ${trian_height*2/5 + move}  z`
        })
        .on("click", function(){
            if(overview.high_or_middle == "high"){
                overview.high_or_middle = "middle";
                overview.change_mode();
            }
            else{
                overview.high_or_middle = "high";
                overview.change_mode();
            }
        })

        let g = this_.svg_menu_bottom.append("g");
        let trans_y = this_.svg_menu_bottom_height * 2 * 0.15;

        g.attr("transform", `translate(0, ${trans_y})`);
        g
        .append("svg:rect")//top
        .attr("class", "top back_rect")
        .attr("x", left_gap)
        .attr("y", 5)
        .attr("width", this.svg_menu_width - left_gap*2)
        .attr("height", title_height)
        .attr("rx", r_left)
        .attr("ry", r_left);
        g
        .append("svg:text")//top
        .attr("class", "top back_text")
        .attr("x", left_gap + this.svg_menu_width/2)
        .attr("y", 5 + title_height/2)
        .style("font-size", font_size)
        .text("Legend");

        let tech_name_list = ["serve", "loo", "sma", "fli", "cho", "dro", "blo", "cut", "par", "lob"];
        g.append("svg:image")
            .attr("xlink:href", "SRC/image/icon.svg")
            .attr("x", this_.bottom_side_width)
            .attr("y", y0)
            .attr("width", this_.svg_menu_width)
            .attr("height", this_.svg_menu_bottom_height/2);

        //left
        for(let j = 0; j < 5; j++){
            g.append("rect")
            .attr("class", `menu front_rect tech${j}`)
            .attr("x", rect_left_x)
            .attr("y", function(i,d){
                return rect_left_y + j * (rect_side + rect_gap);
            })
            .attr("width", rect_side)
            .attr("height", rect_side)
            .attr("rx", rect_r)
            .attr("ry", rect_r);

            g.append("text")
            .attr("class", `menu front_text`)
            .attr("x", rect_left_x + rect_side + rect_side)
            .attr("y", function(i,d){
                return rect_left_y + j * (rect_side + rect_gap) + rect_side/2;
            })
            .attr("font-size", rect_side*0.6)
            .text(tech_name_list[j]);

        }


        //right
        for(let j = 5; j < 10; j++){
            g.append("rect")
            .attr("class", `menu front_rect tech${j}`)
            .attr("x", rect_right_x)
            .attr("y", function(i,d){
                return rect_right_y + (j-5) * (rect_side + rect_gap);
            })
            .attr("width", rect_side)
            .attr("height", rect_side)
            .attr("rx", rect_r)
            .attr("ry", rect_r);

            g.append("text")
            .attr("class", `menu front_text`)
            .attr("x", rect_right_x + rect_side + rect_side)
            .attr("y", function(i,d){
                return rect_right_y + (j-5) * (rect_side + rect_gap) + rect_side/2;
            })
            .attr("font-size", rect_side*0.6)
            .text(tech_name_list[j]);
        }


        //path
        g.append("path")
        .attr("class", "menu front_line")
        .attr("d", function(d,i){
            return `M ${this_.svg_menu_width - 5/163*this_.svg_menu_width} ${y0 + this_.svg_menu_bottom_height/4 - 5/163*this_.svg_menu_width} L ${this_.svg_menu_width - 5/163*this_.svg_menu_width} ${y0 + this_.svg_menu_bottom_height*3/4 - 120/163*this_.svg_menu_width} L ${this_.svg_menu_width - 20/163*this_.svg_menu_width} ${y0 + this_.svg_menu_bottom_height*3/4 - 100/163*this_.svg_menu_width}`
        });


    }
}