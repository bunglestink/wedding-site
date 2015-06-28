(function() {
    angular.module('App', [
        'ngAnimate',
        'ngRoute',
        'ngSanitize'
    ]);
    angular.module('App').config(function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {templateUrl: '/app/welcome.ng'})
            .when('/accommodations', {templateUrl: '/app/accommodations.ng'})
            .when('/events', {templateUrl: '/app/events.ng'})
            .when('/registry', {templateUrl: '/app/registry.ng'})
            .when('/rsvp', {
                controller: RsvpController,
                controllerAs: 'ctrl',
                templateUrl: '/app/rsvp.ng'
            })
            .otherwise({redirectTo: '/'});
    });

    angular.module('App').run(function($rootScope) {
        $rootScope.daysRemaining = getDaysRemaining();
    });

    function getDaysRemaining() {
        var ONE_DAY = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var weddingDate = new Date(2015,7,1);
        var currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMilliseconds(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        return Math.round(Math.abs((weddingDate.getTime() - currentDate.getTime())/(ONE_DAY)));
    }



    function RsvpController($scope, $http) {
        this.firstName = '';
        this.lastName = '';
        this.emailAddress = '';
        this.guests = [];
        this.attendingCeremony = null;
        this.attendingReception = null;
        this.songRequests = [];
        this.stayingAtHotel = null;
        this.comments = '';

        this.formState = 'NEW';
        this.numberOfGuests = 1;
        this.errors = [];
        this.$http = $http;
        var self = this;
        $scope.$watch('ctrl.numberOfGuests', function(count, oldCount) {
            var regex = /^[0-9]?$/gi;
            var isValid = count.toString().match(regex);
            if (!isValid) {
                self.numberOfGuests = oldCount;
                count = oldCount
            }
            if (!count) {
                self.guests = [];
                return;
            }
            if (count < 1) {
                count = 1;
            }
            var otherGuests = count - 1;
            while (otherGuests < self.guests.length) {
                self.guests.pop();
            }
            while (otherGuests > self.guests.length) {
                self.guests.push({firstName: '', lastName: ''});
            }
            self.numberOfGuests = count;
        });

    }

    RsvpController.prototype.submit = function() {
        this.validate();
        if (this.errors.length) {
            window.alert('Please provide missing information.');
            return;
        }
        var body = {
            firstName: this.firstName,
            lastName: this.lastName,
            emailAddress: this.emailAddress,
            guests: this.guests,
            attendingCeremony: this.attendingCeremony,
            attendingReception: this.attendingReception,
            songRequests: this.songRequests,
            stayingAtHotel: this.stayingAtHotel,
            comments: this.comments
        };
        var self = this;
        this.$http.post('/api/rsvp.php', body).then(function() {
            self.formState = 'COMPLETE';
        }, function() {
            self.formState = 'NEW';
            window.alert('An error occurred, please try again.  If error continues, please call Julie at 412-965-9459.');
        });
    };
    RsvpController.prototype.validate = function() {
        this.errors = [];
        if (!this.firstName) {
            this.errors.push('First name is required.');
        }
        if (!this.lastName) {
            this.errors.push('Last name is required.');
        }
        if (!this.emailAddress) {
            this.errors.push('Email address is required.');
        }
        for (var i = 0; i < this.guests.length; i++) {
            var guest = this.guests[i];
            if (!guest.firstName || !guest.lastName) {
                this.errors.push('First and last name are required for guests.');
                break;
            }
        }
        if (!this.attendingCeremony) {
            this.errors.push('Please indicate whether attending the ceremony (if unsure, choose one and note in comments).');
        }
        if (!this.attendingReception) {
            this.errors.push('Please indicate whether attending the reception (if unsure, choose one and note in comments).');
        }
        if (!this.stayingAtHotel) {
            this.errors.push('Please indicate whether staying at the hotel (if unsure, choose one and note in comments).');
        }
    };
    RsvpController.prototype.isAttending = function() {
        return this.attendingCeremony === 'yes' || this.attendingReception === 'yes';
    };
    RsvpController.prototype.addSong = function() {
        this.songRequests.push({name: ''});
    };
    RsvpController.prototype.removeSong = function(songRequest) {
        for (var i = 0; i < this.songRequests.length; i++) {
            if (songRequest === this.songRequests[i]) {
                this.songRequests.splice(i, 1);
                return;
            }
        }
    };
}());