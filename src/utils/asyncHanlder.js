function asyncHandler(fn) {
    return function(req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next); // mota mota if we catch any error here he do next()
        // next is out last middleware wich is error

        // fn()() this ahppens in promise
    };
}

  
module.exports = asyncHandler;


//Immediately Invoked Function Expression (IIFE). Let’s break down what that means in your context.

//read Immediately Invoked Function Expression (IIFE)for this 