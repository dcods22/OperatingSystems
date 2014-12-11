///<reference path="..//host/memory.ts" />
module TSOS {

    export class HDManager {

        constructor() {
            _HardDrive = new HardDrive();
            this.resetHardDrive();
            this.updateHardDrive();
        }

        public resetHardDrive() : void{
            _HardDrive.resetHardDrive();
            this.createSwap();
        }

        public updateHardDrive() : void{
            _HardDrive.updateHardDrive();
        }

        public getByLoc(loc){
            var finalLoc = loc;

            if(finalLoc.length < 4)
                finalLoc = loc.substring(0,1) + ":" + loc.substring(1,2) + ":" + loc.substring(2,3);

            return _HardDrive.getByLoc(finalLoc);
        }

        public setByLoc(loc, value) : void{
            var finalLoc = loc;

            if(finalLoc.length < 4)
                finalLoc = loc.substring(0,1) + ":" + loc.substring(1,2) + ":" + loc.substring(2,3);

            _HardDrive.setByLoc(finalLoc, value);
        }

        public createFile(filename){
            //add file to file list
            if(filename.substr(0,1) == "."){
                _StdOut.putText("You cannot create a file starting with a .");
            }else{
                if(fileList.indexOf(filename) > -1){
                    _StdOut.putText("File Already Exists");
                    _StdOut.advanceLine();
                }else{
                    this.makeFile(filename);
                    _StdOut.putText(filename + " has been created");
                    _StdOut.advanceLine();
                }
            }

        }

        public readFile(filename){
            //check if exists in file list
            if(filename.substr(0,1) == "."){
                _StdOut.putText("You cannot delete a file starting with a .");
            }else{
                if(fileList.indexOf(filename) > -1){
                    var hex = "";

                    var pos = this.getLocation(filename);
                    var point = this.getPointer(filename);

                    while(point != "000"){
                        var oldPoint = point;
                        var val = this.getByLoc(point);
                        point = val.substring(1,4);
                        hex = hex + val.substring(4);
                    }

                    console.log(hex);

                    var file = this.hexToContent(hex);

                    _StdOut.putText("File: " + filename + "...");
                    _StdOut.advanceLine();
                    _StdOut.putText(file);
                    _StdOut.advanceLine();
                }else{
                    _StdOut.putText("File does not exist");
                    _StdOut.advanceLine();
                }
            }
        }

        public writeFile(infoString){
            var exp = infoString.split("%%");
            var filename = exp[0];
            var filecontent = this.contentToHex(exp[1].substring(1, exp[1].length - 1));

            if(filename.substr(0,1) == "."){
                _StdOut.putText("You cannot delete a file starting with a .");
            }else{
                //check if exists in file list
                if(fileList.indexOf(filename) > -1){
                    //search hd for filename in contents
                    //grab that pointer
                    var hexFile = this.nameToHex(filename);
                    var point = this.getPointer(filename);

                    //place data in HD
                    if(filecontent.length > 60){
                        //use that point and put the first data in
                        //go to that next block and repeat
                        for(var x=0; x < (filecontent.length / 60); x++){
                            //find next free block
                            var nextPoint = this.nextFreeDataBlock();
                            var contentPart = filecontent.substring(x * 60, (x + 1) * 60);
                            var hexString = "1" +  nextPoint + contentPart;
                            this.setByLoc(point, this.padWithZeros(hexString));
                            this.updateHardDrive();
                            point = nextPoint;
                        }
                    }else{
                        var hexString = "1" + "000" + this.padWithZeros(filecontent);
                        this.setByLoc(point, hexString);
                        this.updateHardDrive();
                    }

                    _StdOut.putText(filename + " has been written to");
                    _StdOut.advanceLine();
                }else{
                    _StdOut.putText("File does not exist");
                    _StdOut.advanceLine();
                }
            }


        }

        public deleteFile(filename){
            var empty = "0000000000000000000000000000000000000000000000000000000000000000";

            if(filename.substr(0,1) == "."){
                _StdOut.putText("You cannot delete a file starting with a .");
            }else{
                var fileLoc = fileList.indexOf(filename);

                //check if exists in file list
                if(fileLoc > -1){

                    fileList.splice(fileLoc, 1);

                    //search hd for filename in contents
                    //grab that pointer
                    var pos = this.getLocation(filename);
                    var point = this.getPointer(filename);

                    this.setByLoc(pos, empty);

                    while(point != "000"){
                        var oldPoint = point;
                        var val = this.getByLoc(point);
                        point = val.substring(1,4);
                        this.setByLoc(oldPoint, empty);
                    }

                    this.updateHardDrive();

                    _StdOut.putText(filename + " has been deleted");
                    _StdOut.advanceLine();
                }else{
                    _StdOut.putText("File does not exist");
                    _StdOut.advanceLine();
                }
            }
        }

        public nameToHex(filename){
            var hexName = "";
            for(var i=0; i < filename.length; i++){
                hexName = hexName + filename.charCodeAt(i).toString(16);
            }

            return this.padWithZeros(hexName);
        }

        public contentToHex(content){
            var hexcontent = "";

            for(var i=0; i < content.length; i++){
                hexcontent += content.charCodeAt(i).toString(16);
            }

            return hexcontent;
        }

        public hexToContent(hex){
            var content = "";

            for(var i=0; i < hex.length; i+=2){
                content += String.fromCharCode(parseInt(hex.substring(i,i+2),16));
            }

            return content;
        }

        public nextFreeDataBlock(){
            var done = false;

            var dataloc = "000";

            for(var m=1; m < 4; m++){
                for(var i=0; i < 8; i++){
                    for(var n=0; n < 8; n++){
                        var hdcontent = this.getByLoc(m.toString()+ i.toString()+ n.toString()).toString();
                        if(hdcontent.substr(0,1) == 0){
                            dataloc = m.toString()+ i.toString()+ n.toString();
                            this.setByLoc(dataloc, "1000000000000000000000000000000000000000000000000000000000000000")
                            done = true;
                            break;
                        }
                    }

                    if(done)
                        break;
                }

                if(done)
                    break;
            }

            return dataloc;
        }

        public getPointer(content){
            //get pointer to data from file name
            var hexcontent = this.nameToHex(content);
            var point = "000";
            var done = false;

            for(var m=0; m < 4; m++){
                for(var i=0; i < 8; i++){
                    for(var n=0; n < 8; n++){
                        var hdcontent = this.getByLoc(m.toString()+ i.toString()+ n.toString());
                        var newFile = hdcontent.substr(4);
                        if(newFile == hexcontent){
                            point = hdcontent.substr(1,3);
                            done = true;
                            break;
                        }

                        if(done)
                            break;
                    }

                    if(done)
                        break;
                }

                if(done)
                    break;
            }

            return point;
        }

        public getLocation(content){
            //get pointer to data from file name
            var hexcontent = this.nameToHex(content);
            var loc = "000";
            var done = false;

            for(var i=0; i < 8; i++){
                for(var n=0; n < 8; n++){
                    var hdcontent = this.getByLoc("0"+ i.toString()+ n.toString());
                    var newFile = hdcontent.substr(4);
                    if(newFile == hexcontent){
                        loc = "0"+ i.toString()+ n.toString();
                        done = true;
                        break;
                    }

                    if(done)
                        break;
                }

                if(done)
                    break;
            }

            return loc;
        }
        public padWithZeros(content){
            for(var i=content.length; i < 64; i++){
                content += "0";
            }

            return content;
        }

        public createSwap(){
            var swap = ".swap_file";
            this.makeFile(swap);
        }

        public makeFile(filename){

            fileList[fileList.length] = filename;

            var dataloc = this.nextFreeDataBlock();

            if(dataloc == "000"){
                _StdOut.putText("There is no free space on the HD");
            }else{
                //find empty location in track one
                var done = false;

                for(var i=0; i < 8; i++){
                    for(var n=0; n < 8; n++){
                        var hdcontent = this.getByLoc("0"+ i.toString()+ n.toString());
                        if(hdcontent.substr(0,1) == 0){
                            var filenamehex = this.nameToHex(filename);
                            this.setByLoc("0"+ i.toString()+ n.toString(), "1" + dataloc + filenamehex);
                            this.updateHardDrive();
                            done = true;
                            break;
                        }

                        if(done)
                            break;
                    }

                    if(done)
                        break;
                }
            }

        }

        public writeSwap(pid, content){
            var point = this.getPointer(".swap_file");

            content = this.trimDown(content);

            while(this.getByLoc(point).substring(0,1) != 0){
                var hdVal = this.getByLoc(point);
                var use = hdVal.substring(4,5);
                var done = false;
                if(use == "0"){
                    //fill with content, if less than 64
                    //get pointer, fill the rest
                    var program = this.padFile(content);
                    var nextPoint = this.nextFreeDataBlock();
                    var initialStr = this.padWithZeros("1" + nextPoint + this.contentToHex("PID:" + pid));
                    this.setByLoc(point, initialStr);

                    for(var i=0; i < (content.length / 60); i++){
                        point = nextPoint;
                        var str = program.substring((i*60), (i*60)+60);
                        nextPoint = this.nextFreeDataBlock();
                        var hexString = this.padWithZeros("1" + nextPoint + str);
                        this.setByLoc(point, hexString);
                    }

                    done = true;
                }

                if(done){
                    break;
                }else{
                    point = hdVal.substring(1,4);
                }
            }

            this.updateHardDrive();
        }

        public getProgram(PID){
            var prog = "";

            var point = this.getPointer(".swap_file");
            var PIDString = this.padWithZeros("PID:" + PID);
            var locPoint = this.getByLoc(point).substring(0,1);
            var hdVal = "";
            var use = "";
            var done = false;
            var pointToProg = "";

            for(var i=0; i < 10; i++){
                var contStr = this.getByLoc(point);
                var content = this.hexToContent(contStr.substring(4));
                if(content = PIDString){
                    pointToProg = point;
                    point = contStr.substring(1,4);
                    for(var n=0; n < 5; n++){
                        //loop through till the program is over and return it
                        hdVal = this.getByLoc(point);
                        use = hdVal.substring(0,1);
                        point = hdVal.substring(1,4);
                        prog += hdVal.substring(4);
                    }

                    done = true;

                }else{
                    point = content.substr(1,4);
                }

                locPoint = this.getByLoc(point).substring(0,1);

                if(done){
                    break;
                }
            }

            prog = this.trimDown(prog);

            return prog;
        }

        public clearProg(point){
            var set = "1000000000000000000000000000000000000000000000000000000000000000";
            var empty = "0000000000000000000000000000000000000000000000000000000000000000";
            var oldPoint = point;
            point = this.getByLoc(oldPoint).substring(1,4);
            this.setByLoc(oldPoint, set);

            while(this.getByLoc(point).substring(0,1) != "0" && point != "000"){
                oldPoint = point;
                point = this.getByLoc(point).substring(1,4);
                this.setByLoc(oldPoint, empty);
            }

            this.updateHardDrive();
        }

        public padFile(content){
            for(var i=content.length; i < 512; i++){
                content += "0";
            }

            return content;
        }

        public trimDown(content){
            var done = false;

            var len = content.length - 1;
            var char = "";
            for(var i=len; i > 0; i--){
                char =content.charAt(i);

                if(char == "0"){
                    content.slice(i);
                }else{
                    done = true;
                }

                if(done){
                    content = content.substring(0, i+1);
                    break;
                }
            }

            return content;
        }

    }
}