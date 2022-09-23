/**
 * @author Sabine Dijt / sabine@levelupgroup.nl
 * @company ClickValue / LevelUp Group
 */

window.penPoller = window.penPoller || function(items, options){
    return new Promise((resolve, reject)=>{
        let scope = options && options.scope || document;                           //use document or other el for querySelector scope
        let all = options && options.all !== undefined ? options.all : false;        //use querySelectorAll
        let timeout = options && options.timeout || 5000;                           //max time
        let interval = options && options.interval || 20;
        let done = false;
        let nextTime = 0;
        let endTime = 0;
  
        const poller = async time => {
            if (endTime === 0) endTime = time + timeout;
    
            if (time > nextTime) {
                nextTime = time + interval;
        
                let cbitems = [];

                let checkitem = e => {
                    if (typeof e === 'function'){   //if function check if true of filled
                        let tmpval = e();
                        if(tmpval) cbitems.push(tmpval);
                    } else if (typeof e === 'boolean' || typeof e === 'number' || typeof e === 'object'){   //if bool, number or object, return value
                        cbitems.push(e);
                    } else if (typeof e === 'string') {
                        let els = all ? scope.querySelectorAll(e) : scope.querySelector(e);
                        if (!/^window\./i.test(e) && ((all && els.length) || (!all && els))) cbitems.push(els);     //if not window object and element(s) present, return element(s)
                        else {
                            e = e.replace(/^window\./i, '');
                            let tmpval,
                                earr = /[\.\]\[]+/.test(e) ? e.replace(/\'\"\]/g,'').split(/[\.\[]+/g) : [e];       //create array from window object path
                            earr.forEach((element, index)=>{            //iterate through window object path
                                let isFunction = /\)$/i.test(element);
                                element = isFunction ? element.split('(')[0] : element;
                                tmpval = (index === 0) ? window[element] : (tmpval !== undefined) ? tmpval[element] : undefined;        //check if next window object is present
                                if(isFunction && tmpval !== undefined) tmpval = tmpval();               //if window object is function execute
                            });
                            if(tmpval !== undefined) cbitems.push(tmpval);      //if value is "" or 0 you still want it returned
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
                else reject();
            } else if(!done) requestAnimationFrame(poller);
        };
        requestAnimationFrame(poller);
    });
}