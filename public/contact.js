document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    contactForm.addEventListener('submit', (e) => {
        let isValid = true;

        // Name Validation
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Name is required';
            nameInput.classList.add('invalid');
            isValid = false;
        } else {
            nameError.textContent = '';
            nameInput.classList.remove('invalid');
        }

        // Email Validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email is required';
            emailInput.classList.add('invalid');
            isValid = false;
        } else if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('invalid');
            isValid = false;
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('invalid');
        }

        // Message Validation
        if (messageInput.value.trim() === '') {
            messageError.textContent = 'Message is required';
            messageInput.classList.add('invalid');
            isValid = false;
        } else {
            messageError.textContent = '';
            messageInput.classList.remove('invalid');
        }

        if (!isValid) {
            e.preventDefault();
        }
    });

    // Real-time validation
    const validateForm = () => {
        const isNameValid = nameInput.value.trim() !== '';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailInput.value.trim() !== '' && emailPattern.test(emailInput.value);
        const isMessageValid = messageInput.value.trim() !== '';

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (isNameValid && isEmailValid && isMessageValid) {
            submitBtn.classList.add('btn-success');
        } else {
            submitBtn.classList.remove('btn-success');
        }
    };

    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                // Clear error if user starts typing again
                if (input.id === 'name') nameError.textContent = '';
                if (input.id === 'email') emailError.textContent = '';
                if (input.id === 'message') messageError.textContent = '';
                input.classList.remove('invalid');
            }
            validateForm();
        });
    });

    // Initial check
    validateForm();
});
