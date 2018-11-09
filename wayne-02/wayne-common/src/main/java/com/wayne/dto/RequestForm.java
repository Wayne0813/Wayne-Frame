package com.wayne.dto;

/**
 * @author Wayne
 * @date 2018/11/6
 */
public class RequestForm {

    private RequestHeader header;
    private Object body;

    public RequestHeader getHeader() {
        return header;
    }

    public void setHeader(RequestHeader header) {
        this.header = header;
    }

    public Object getBody() {
        return body;
    }

    public void setBody(Object body) {
        this.body = body;
    }

    @Override
    public String toString() {
        return "RequestForm{" +
                "header=" + header +
                ", body=" + body +
                '}';
    }
}
