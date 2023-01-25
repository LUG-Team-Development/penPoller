/**
 * @author Sabine Dijt / sabine@levelupgroup.nl
 * @company ClickValue / LevelUp Group
 */

 window.penPoller = window.penPoller || function(reqItems, options){
    return new Promise((resolve, reject)=>{
        let scope = options && options.scope || document;                           //use document or other el for querySelector scope
        let all = options && options.all !== undefined ? options.all : false;       //use querySelectorAll
        let timeout = options && options.timeout || 5000;                           //max time
        let interval = options && options.interval || 20;
        let done = false;
        let nextTime = 0;
        let endTime = 0;
  
        const poller = time => {
            if (endTime === 0) endTime = time + timeout;
    
            if (time > nextTime) {
                nextTime = time + interval;
        
                let cbItems = [];

				let checkWinObject = (e) => {
					e = e.replace(/^window[\.\[]{1}/i, '');
                    let tmpval;
                    let earr = /[\.\]\[]+/.test(e) ? e.replace(/[\'\"\]]{1}/g,'').split(/[\.\[]{1}/g) : [e];       //create array from window object path
                    
                    //iterate through window object path
                    earr.forEach((element, index)=>{
                        let isFunction = /\)$/i.test(element);
                        let params;

                        if(isFunction){
                            let arr = element.split(/[\(\)]+/);
                            element = arr[0];
                            if(arr[1]) params = arr[1].split(/\,(\s)?/g);
                        }
                        
                        //check if next object in path is present
                        tmpval = (index === 0) ? window[element] : (tmpval !== undefined) ? tmpval[element] : undefined;
                        
                        //if object is function execute
                        if(isFunction && tmpval !== undefined){
                            tmpval = tmpval(params);
                        }
                    });

                    //if value is "" or 0 you still want it returned
                    if(tmpval !== undefined) cbItems.push(tmpval);
				}
                let checkitem = (e, i) => {
                    if (typeof e === 'function'){   //if function check if true of filled
                        let tmpval = e();
                        if(tmpval) cbItems.push(tmpval);
                    } else if (typeof e === 'boolean'){ //if boolean check if true
                        if(e === true) cbItems.push(e);
                    } else if (typeof e === 'object'){   //if object, check if not undefined
                        if(e !== undefined) cbItems.push(e);
                    } else if (typeof e === 'string') { //if string, check if window object or element selector
                        if (!/^window[\.\[]{1}/i.test(e)){ //if not window object and element(s) present, return element(s)
                            let els = all ? scope.querySelectorAll(e) : scope.querySelector(e);
                            if((all && els.length) || (!all && els)) {
                            	cbItems.push(els);
                            } else checkWinObject(e)
                        } else {  //if window object check window object path
                            checkWinObject(e);
                        }
                    }
                };
                let isArray = Array.isArray(reqItems);
                if(isArray){
                    reqItems.forEach((e, i)=>{
                        checkitem(e, i);
                    });
                } else checkitem(reqItems, 0);

                //if all elements are present, return them in the resolve so you can use them without having to retrieve them again in your code
                if ((isArray && cbItems.length === reqItems.length) || !isArray && cbItems.length === 1){
                    done = true;
                    resolve(isArray ? cbItems : cbItems[0]);
                } else if (time < endTime) requestAnimationFrame(poller);
                else return false;
            } else if(!done) requestAnimationFrame(poller);
        };
        requestAnimationFrame(poller);
    });
};