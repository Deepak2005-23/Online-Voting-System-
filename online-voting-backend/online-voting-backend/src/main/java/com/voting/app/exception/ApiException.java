package com.voting.app.exception;

public class ApiException extends RuntimeException {
    public ApiException(String message) {
        super(message);
    }
}
