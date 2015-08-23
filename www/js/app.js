// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
      
    function setupDb(db, cb) {
        db.get(function(err, res, body){
            console.log(JSON.stringify(["before create db put", err, res, body]))
            db.put(function(err, res, body){
                db.get(cb)
            })
        })
    };
      
    function setupViews(db,cb) {
        var design = "_design/expenseTrackNew"
        db.put(design, {
            views : {
                expenseTrackListsNew : {
                    map : function(doc) {
                        if (doc.trackType == "expense" && doc.date && doc.merchant && doc.amount) {
                            emit([doc.date.year,doc.date.month,doc.date.date] , doc);
                        }
                    }.toString()
                },
                
                expenseTrackByAccount : {
                    map : function(doc) {
                        emit([doc.account,doc.merchant], { account:  doc.account, merchant: doc.merchant, amount: doc.amount.value, currency : doc.amount.currency});
                    }.toString(),
                    
                    reduce : function(keys,values,rereduce) {
                         var response = {"account" : 0, "merchant": 0, "sum" : 0 };
                          for(i=0; i<values.length; i++)
                          {
                             response.sum = response.sum + values[i].amount;
                             response.merchant = values[i].merchant;
                             response.account = values[i].account;
                          }
                         return response;
                    }.toString()
                }, 
                
                expenseTrackByDate : {
                    map : function(doc) {
                        emit([doc.date.year,doc.date.month,doc.date.date] , doc);
                    }.toString(), 
                    
                    reduce : function(keys,values,rereduce) {
                        var response = { "totalExpenses" : 0 };
                        for(i=0; i<values.length; i++)
                        {
                         response.totalExpenses = response.totalExpenses + values[i].amount.value;
                         response.year = values[i].date.year;
                         response.month = values[i].date.month;
                         response.date = values[i].date.date;
                        }
                        return response;
                    }.toString()
                }
            }
        }, function(){
            cb(false, db([design, "_view"]))
        })   
    };
      
    
    if (window.cblite) {
        cblite.getURL(function(err, url) {
            if (err) {
                console.log('db not initialized');
            } else {
            
                window.server = coax(url);
                var db = coax([url, appDbName]);
                
                setupDb(db, function(err, info) {
                    if (err) {
                        console.log('err')
                    } else {
                        setupViews(db, function(err, views) {
                            if (err) {
                                console.log('err views')
                            } else {
                                console.log('views success');
                                window.config = {
                                db: db,
                                s: coax(url),
                                views : views
                                };
                                return config;
                            }
                        });
                    }
                });
            }
        });
    } else {
        console.log('cblite pluign not intilized');
    }
  
    var coax = require("coax"),
	appDbName = "sms";
      
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
  
  .state('app.sms', {
    url: '/sms',
    views: {
      'menuContent': {
        templateUrl: 'templates/sms.html',
        controller: 'SmsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
