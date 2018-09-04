export enum ErrorType {
    DuplicateName,
    NameTooShort,
}

/**
 * Called when a new user is submitting a name
 */
export function getErrorText(errorType: ErrorType) {
    switch(errorType) {
        case ErrorType.DuplicateName: {
            return "Name is already taken";
        }
        case ErrorType.NameTooShort: {
            return "Chosen name is too short";
        }
        default:
            return "Aww, sorry, an unexpected error occurred. Please try again!";
    }
}
