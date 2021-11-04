<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<%
Dim targetUrl, time, data
targetUrl = Request.Form("targetUrl")
time = Request.Form("time")
data = Request.Form("data")

If (Len("" & targetUrl) = 0) Or (Len("" & time) = 0) Or (Len("" & data) = 0) Then
%>
<html><head><title>ERROR</title></head><body><h1>ERROR</h1></body></html>
<%
Else
    Dim result
    Set objHttp = Server.CreateObject("WinHTTP.WinHTTPRequest.5.1")
    objHttp.Open "POST", targetUrl, False
    objHttp.SetRequestHeader "Origin", "http://infozone"
    objHttp.SetRequestHeader "Content-Type", "application/json"
    objHttp.SetRequestHeader "icms-key", time
    objHttp.Send data

    Response.AddHeader "Content-Type", "application/json"
    If objHttp.Status = 200 Then
        result = objHttp.responseText
    Else
        result = "{""status"":""error"", ""time"": """ & time & """, ""errors"": [""Server Response Code " & objHttp.Status & """]}"
    End If
    Response.Write result
    Set objHttp = Nothing 
End If
%>
