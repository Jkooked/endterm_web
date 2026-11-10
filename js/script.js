/* FLY FUN endterm interactions */
$(function () {
    // Booking form validation and password feedback.
    const $booking = $('#booking-form');
    if ($booking.length) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const selectedPackage = new URLSearchParams(location.search).get('package');
        if ($('#packageSelect option').filter(function () { return this.value === selectedPackage; }).length) {
            $('#packageSelect').val(selectedPackage);
        }

        function validateBooking(showFeedback = true) {
            const email = $('#emailAddr').val().trim();
            const password = $('#password').val();
            const confirmation = $('#confirmPassword').val();
            const errors = [];
            if (!$('#fullName').val().trim()) errors.push('Enter your name.');
            if (!email) errors.push('Enter your email.');
            else if (!emailPattern.test(email)) errors.push('Enter a valid email.');
            if (!password || password.length < 8) errors.push('Password must have at least 8 characters.');
            if (password !== confirmation) errors.push('Passwords do not match.');
            if (!$('#packageSelect').val()) errors.push('Choose a tour package.');
            if (!$('#userMessage').val().trim()) errors.push('Enter a message.');

            if (showFeedback) {
                $('#booking-feedback')
                    .removeClass('alert-info alert-success alert-danger')
                    .addClass(errors.length ? 'alert-danger' : 'alert-success')
                    .text(errors.length ? errors.join(' ') : 'All fields look good.')
                    .prop('hidden', false);
            }
            return errors.length === 0;
        }

        $booking.on('input change', 'input, textarea, select', () => validateBooking());
        $('#password').on('input', function () {
            const value = this.value;
            const score = [value.length >= 8, /[A-Za-z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
            const level = !value ? ['', '', 0] : score <= 1 ? ['Weak', 'bg-danger', 25] : score <= 2 ? ['Medium', 'bg-warning', 60] : ['Strong', 'bg-success', 100];
            $('#passwordStrength').text(value ? `${level[0]} password` : 'Use 8+ characters, including letters and numbers.');
            $('#passwordBar').removeClass('bg-danger bg-warning bg-success').addClass(level[1]).css('width', `${level[2]}%`);
        });
        $('#confirmPassword').on('input', function () {
            const matches = !this.value || this.value === $('#password').val();
            $('#passwordMatch').text(this.value ? (matches ? 'Passwords match.' : 'Passwords do not match.') : '')
                .toggleClass('text-success', matches).toggleClass('text-danger', !matches);
        });
        $booking.on('submit', function (event) {
            event.preventDefault();
            if (!validateBooking()) return;
            const data = new FormData(this);
            $('#booking-feedback').removeClass('alert-danger').addClass('alert-success')
                .text(`Preview for ${data.get('fullName')} — ${$('#packageSelect option:selected').text()}. Nothing was sent.`)
                .prop('hidden', false);
        });
    }
});
