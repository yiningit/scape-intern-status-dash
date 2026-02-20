// Handles special Enter key behaviour for forms

// Form-level check fields and submit if valid
export function handleFormEnter(e, onEnter) {
    if (e.key !== 'Enter') return;

    const form = e.currentTarget;
    if (!form) throw new Error("form failed");
    if (e.isComposing) return;   // avoid interfering with IME composition

    if (form.checkValidity()) {
        e.preventDefault();
        if (typeof onEnter === 'function') {
            onEnter();
        } else {
            throw new Error("Failed to submit form through Enter key.")
        }
    }
};

// Field-level decide to move to given field or run submit function
export function onEnterFocusNext(e, nextRefOrSubmit) {
    if (e.key !== 'Enter') return;

    e.preventDefault();   // avoid submitting form prematurely

    if (typeof nextRefOrSubmit === 'function') {
        nextRefOrSubmit();
    } else if (nextRefOrSubmit?.current) {
        nextRefOrSubmit.current.focus();
        nextRefOrSubmit.current.select?.();
    }
};
