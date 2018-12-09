import React from 'react';

export default() => (
 <div class="container">
    <div class="row">
        <div class="col-md-12 text-center">
            <div class="error-template">
                <h1>
                    Oops!</h1>
                <h2>
                    404 Not Found</h2>
                <div class="error-details">
                    Sorry, an error has occured, Requested page not found!
                </div>
                <div class="error-actions">
                    <a href="/" class="btn btn-primary btn-lg"><span class="glyphicon glyphicon-home"></span>
                        Take Me Home</a>
                </div>
            </div>
        </div>
    </div>
</div>
);