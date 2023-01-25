/**
 * @author Sabine Dijt / sabine@levelupgroup.nl
 * @company ClickValue / LevelUp Group
 */

window.penPoller = window.penPoller || function(items, options){
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
        
                let cbitems = [];

                let checkitem = e => {
                    if (typeof e === 'function'){   //if function check if true of filled
                        let tmpval = e();
                        if(tmpval) cbitems.push(tmpval);
                    } else if (typeof e === 'boolean'){ //if boolean check if true
                        if(e === true) cbitems.push(e);
                    } else if (typeof e === 'number' || typeof e === 'object'){   //if number or object, check if not undefined
                        if(e !== undefined) cbitems.push(e);
                    } else if (typeof e === 'string') { //if string, check if window object or element selector
                        let els = all ? scope.querySelectorAll(e) : scope.querySelector(e);
                        if (!/^window\./i.test(e) && ((all && els.length) || (!all && els))) cbitems.push(els); //if not window object check if element(s) present
                        else {  //if window object check window object path
                            e = e.replace(/^window\./i, '');
                            let tmpval;
                            let earr = /[\.\]\[]+/.test(e) ? e.replace(/\'\"\]/g,'').split(/[\.\[]+/g) : [e];   //create array from window object path
                            
                            //iterate through window object path
                            earr.forEach((element, index)=>{
                                let isFunction = /\)$/i.test(element);
                                element = isFunction ? element.split('(')[0] : element;
                                
                                //check if next object in path is present
                                tmpval = (index === 0) ? window[element] : (tmpval !== undefined) ? tmpval[element] : undefined;
                                
                                //if object is function execute
                                if(isFunction && tmpval !== undefined) tmpval = tmpval();
                            });

                            //if value is "" or 0 you still want it returned
                            if(tmpval !== undefined) cbitems.push(tmpval);
                        }
                    }
                };
                let isArray = Array.isArray(items);
                if(isArray){
                    items.forEach((e, i)=>{
                        checkitem(e);
                    });
                } else checkitem(items);

                //if all elements are present, return them in the resolve so you can use them without having to retrieve them again in your code
                if ((isArray && cbitems.length === items.length) || !isArray && cbitems.length === 1){
                    done = true;
                    resolve(isArray ? cbitems : cbitems[0]);
                } else if (time < endTime) requestAnimationFrame(poller);
                else return false;
            } else if(!done) requestAnimationFrame(poller);
        };
        requestAnimationFrame(poller);
    });
};