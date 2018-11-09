package com.wayne.exception;

/**
 * @author Wayne
 * @date 2018/11/6
 */
public class RRException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private Integer code = 500;
    private String message;


    public RRException(String message) {
        super(message);
        this.message = message;
    }

    public RRException(String message, Integer code) {
        super(message);
        this.message = message;
        this.code = code;
    }

}
