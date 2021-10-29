<%

' ASPTwitter 1.1
' Release date: 1 June 2013
' Author: Tim Acheson
' Support Twitter: @timacheson
' License: source open, full details available from the author.
' Project URL: http://www.timacheson.com/Blog/2013/jun/asptwitter

' *** Please keep the comments above with the code below so I can help people with their code if they need it. ***

const API_BASE_URL = "https://api.twitter.com"
const PROXY_SERVER = "proxy.omega.dce-eir.net:8080"

' Summary: Provides convenient methods for accessing the Twitter API within a legacy classic ASP web application.
Class ASPTwitter

	' Basic authentication for Application-only model.
	Private strConsumerKey
	Private strConsumerSecret
	
	' OAuth authentication for Application-user model.
	Private strAccessToken
	Private strAccessTokenSecret

	Public strBearerToken

	Private Sub Class_Initialize()
	End Sub

	' Set your application's authentication credentials for the Twitter API.
	' NOTE: Get your consumer key and consumer secret here: https://dev.twitter.com/apps
	Public Sub Configure(sConsumerKey, sConsumerSecret)	
		strConsumerKey = sConsumerKey
		strConsumerSecret = sConsumerSecret
	End Sub

	' Set your application's OAuth authentication credentials for the Twitter API.
	' NOTE: Get your application's credentials here: https://dev.twitter.com/apps
	Public Sub ConfigureOAuth(sAccessToken, sAccessTokenSecret)	
		strAccessToken = sAccessToken
		strAccessTokenSecret = sAccessTokenSecret
	End Sub

	Public Sub Login()
		' NOTE: For optimal performance and resilience, the bearer token should be cached for 15 mins.
		
		Call SetBearerToken(GetBearerTokenJSON)
		
		
		
	End Sub
	
	Public Sub Logout()
		DeleteBearerTokenJSON
	End Sub

	' Gets user timeline as structured object, using AXE JSON Parser.
	Public Function GetUserTimeline(ByVal sUsername, ByVal iCount, ByVal bExcludeReplies, ByVal bIncludeRTs)
		Set GetUserTimeline = JSON.Parse(GetUserTimelineJSON(sUsername, iCount, bExcludeReplies, bIncludeRTs))
	End Function

	' Gets search as structured object, using AXE JSON Parser.
	Public Function GetSearch(sQuery, iCount, lMaxID)
		Set GetSearch = JSON.Parse(GetSearchJSON(sQuery, iCount, lMaxID))
	End Function

	' Posts a tweet, and returns API response using AXE JSON Parser.
	Public Function UpdateStatus(sStatus)
		Set UpdateStatus = JSON.Parse(UpdateStatusJSON(sStatus))
	End Function

	' Underlying API calls

	' Sets bearer token from JSON string returned by Twitter API authentication.
	Private Sub SetBearerToken(ByRef sBearerTokenJSON)
		
		'On Error Resume Next
		
		Dim oVbsJson : Set oVbsJson = New VbsJson
		
		' Troubleshooting: an error here early on usually just means you haven't set values for ClientKey and ClientSecret yet.
		'response.write sBearerTokenJSON
		Dim oJSONToken : Set oJSONToken = oVbsJson.Decode(sBearerTokenJSON)

		strBearerToken = oJSONToken("access_token")

		Set oJSONToken = Nothing
		Set oVbsJson = Nothing
		
		If Err Then

			%><h2>ASPTwitter error: Have you set values for ClientKey and ClientSecret yet?</h2><%
			Response.Flush()
			' Is the Twitter API down? Always cache the last successful response as backup. Look for an error message:
			'Response.Write "<p>Or is Twitter's API down again:<br /><textarea cols=""100"" rows=""20"" >" & sBearerTokenJSON & "</textarea></p>" : Response.Flush()

		End If

	End Sub

	' Gets bearer token for application-only authentication from Twitter API 1.1.
	' Application-only authentication: https://dev.twitter.com/docs/auth/application-only-auth
	' API endpoint oauth2/token: https://dev.twitter.com/docs/api/1.1/post/oauth2/token
	Private Function GetBearerTokenJSON
		Dim sURL : sURL = API_BASE_URL + "/oauth2/token"

		Dim oXmlHttp: Set oXmlHttp = Server.CreateObject("MSXML2.ServerXMLHTTP.6.0") 
 		oXmlHttp.setProxy "2", PROXY_SERVER, "<local>"		
                oXmlHttp.setOption 2, 13056 
		oXmlHttp.open "POST", sURL, False

		oXmlHttp.setRequestHeader "Content-Type", "application/x-www-form-urlencoded;charset=UTF-8"

		oXmlHttp.setRequestHeader "User-Agent", "timacheson.com"
		
		oXmlHttp.setRequestHeader "Authorization", "Basic " & Base64_Encode(strConsumerKey & ":" & strConsumerSecret)				''''''''''''''''''''''''''''''''''''''''''& "=="
		
		oXmlHttp.send "grant_type=client_credentials"

		oXmlHttp.getAllResponseHeaders
		
		GetBearerTokenJSON = oXmlHttp.responseText

		Set oXmlHttp = Nothing

	End Function

	' API oauth2/token: https://dev.twitter.com/docs/api/1.1/post/oauth2/token
	Private Function DeleteBearerTokenJSON

		Dim sURL : sURL = API_BASE_URL + "/oauth2/invalidate_token"

		Dim oXmlHttp : Set oXmlHttp = Server.CreateObject("MSXML2.ServerXMLHTTP.6.0") 
 		oXmlHttp.setProxy "2", PROXY_SERVER, "<local>"		
                oXmlHttp.setOption 2, 13056 
		oXmlHttp.open "POST", sURL, False
		
		oXmlHttp.setRequestHeader "Content-Type", "application/x-www-form-urlencoded;charset=UTF-8"
		oXmlHttp.setRequestHeader "User-Agent", "timacheson.com"
		oXmlHttp.setRequestHeader "Authorization", "Basic " & Base64_Encode(strConsumerKey & ":" & strConsumerSecret)

		oXmlHttp.send "access_token=" & strBearerToken

		DeleteBearerTokenJSON = oXmlHttp.responseText

		Set oXmlHttp = Nothing

	End Function

	' API user_timeline: https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
	Private Function GetUserTimelineJSON(ByVal sUsername, ByVal iCount, ByVal bExcludeReplies, ByVal bIncludeRTs)
		
		Dim sURL : sURL = API_BASE_URL + "/1.1/statuses/user_timeline.json" & "?screen_name=" & sUsername & "&count=" & iCount & "&exclude_replies=" & LCase(bExcludeReplies) & "&include_rts=" & LCase(bIncludeRTs)

		Dim oXmlHttp : Set oXmlHttp = Server.CreateObject("MSXML2.ServerXMLHTTP.6.0") 
 		oXmlHttp.setProxy "2", PROXY_SERVER, "<local>"
                oXmlHttp.setOption 2, 13056 		
		oXmlHttp.open "GET", sURL, False
		oXmlHttp.setRequestHeader "User-Agent", "timacheson.com"
		oXmlHttp.setRequestHeader "Authorization", "Bearer " & strBearerToken
		oXmlHttp.send

		GetUserTimelineJSON = oXmlHttp.responseText

		Set oXmlHttp = Nothing
		
		REM: A JSON viewer can be useful here: http://www.jsoneditoronline.org/
		'Response.Write "<textarea cols=""100"" rows=""50"" >" & GetUserTimelineJSON & "</textarea>" : Response.Flush()

	End Function
	
	' API search/tweets: https://dev.twitter.com/docs/api/1.1/get/search/tweets
	Private Function GetSearchJSON(sQuery, iCount, lMaxID)
		
		Dim sURL : sURL = API_BASE_URL + "/1.1/search/tweets.json" & "?q=" & sQuery & "&count=" & iCount

		If IsNumeric(lMaxID) Then
			sURL = sURL & "&max_id=" & lMaxID
		End If

		Dim oXmlHttp : Set oXmlHttp = Server.CreateObject("MSXML2.ServerXMLHTTP.6.0") 
		oXmlHttp.setProxy "2", PROXY_SERVER, "<local>"
                oXmlHttp.setOption 2, 13056 
		oXmlHttp.open "GET", sURL, False
		oXmlHttp.setRequestHeader "User-Agent", "timacheson.com"
		oXmlHttp.setRequestHeader "Authorization", "Bearer " & strBearerToken

		oXmlHttp.send

		GetSearchJSON = oXmlHttp.responseText

		Set oXmlHttp = Nothing
		
		REM: A JSON viewer can be useful here: http://www.jsoneditoronline.org/
		'Response.Write "<textarea cols=""100"" rows=""50"" >" & GetSearchJSON & "</textarea>" : Response.Flush()

	End Function

	' Gets bearer token for application-only authentication from Twitter API 1.1.
	' Application-user authentication: https://dev.twitter.com/docs/auth/using-oauth
	' and: https://dev.twitter.com/docs/auth/authorizing-request
	' API endpoint statuses/update (post a tweet): https://dev.twitter.com/docs/api/1.1/post/statuses/update
	Private Function UpdateStatusJSON(sStatus)

		Dim sURL : sURL = API_BASE_URL + "/1.1/statuses/update.json"

		Dim oXmlHttp: Set oXmlHttp = Server.CreateObject("MSXML2.ServerXMLHTTP.6.0") 
 		oXmlHttp.setProxy "2", PROXY_SERVER, "<local>"
                oXmlHttp.setOption 2, 13056 		
		oXmlHttp.open "POST", sURL, False
		oXmlHttp.setRequestHeader "Content-Type", "application/x-www-form-urlencoded;charset=UTF-8"
		oXmlHttp.setRequestHeader "User-Agent", "timacheson.com"
		oXmlHttp.setRequestHeader "Authorization", "OAuth " & GetOAuthHeader(sURL, sStatus)
		
		oXmlHttp.send "status=" & Server.URLEncode(sStatus) ' Encoded spaces as + in request body.

		UpdateStatusJSON = oXmlHttp.responseText

		Set oXmlHttp = Nothing

		REM: A JSON viewer can be useful here: http://www.jsoneditoronline.org/
		' To fix error message "Read-only application cannot POST" go to your application's "Application Type" settings at dev.twitter.com/apps and set "Access" to "Read and Write".
		' After changing access to read/write you must click the button to generate new auth tokens and then use those.
		Response.Write "<textarea cols=""100"" rows=""3"" >" & UpdateStatusJSON & "</textarea>" : Response.Flush()

	End Function

	Private Function GetOAuthHeader(ByVal sURL, ByVal sStatus)

		Dim m_objUtils: Set m_objUtils = New cLibOAuthUtils

		Dim oauth_version : 			oauth_version = "1.0"
		Dim oauth_signature_method : 	oauth_signature_method = "HMAC-SHA1"

		Dim resource_url : 				resource_url = sURL

		Dim oauth_timestamp : 			oauth_timestamp  = m_objUtils.TimeStamp
		Dim oauth_nonce : oauth_nonce =	m_objUtils.Nonce & m_objUtils.Nonce & m_objUtils.Nonce

		Dim oauth_consumer_key : 		oauth_consumer_key = strConsumerKey
		Dim oauth_consumer_secret : 	oauth_consumer_secret = strConsumerSecret

		Dim oauth_token : 				oauth_token = strAccessToken
		Dim oauth_token_secret : 		oauth_token_secret = strAccessTokenSecret

		Dim baseFormat : baseFormat = "oauth_consumer_key={0}&oauth_nonce={1}&oauth_signature_method={2}" & _
	    					"&oauth_timestamp={3}&oauth_token={4}&oauth_version={5}"

		baseFormat = baseFormat & "&status={6}"

		baseFormat = HeaderEncodeParam(baseFormat)
		
		sStatus = HeaderEncodeValue(sStatus)

		Dim baseString : baseString = baseFormat
		baseString = Replace(baseString, "{0}", 			oauth_consumer_key)
		baseString = Replace(baseString, "{1}", 			oauth_nonce)
		baseString = Replace(baseString, "{2}", 			oauth_signature_method)
		baseString = Replace(baseString, "{3}", 			oauth_timestamp)
		baseString = Replace(baseString, "{4}", 			oauth_token)
		baseString = Replace(baseString, "{5}", 			oauth_version)
		
		baseString = Replace(baseString, "{6}", 			Server.URLEncode(sStatus))	' Spaces were %20 now become '%2520 

		baseString = "POST&" & URLEncodeForHeader(resource_url) & "&" & baseString

		Dim compositeKey : compositeKey = Server.URLEncode(oauth_consumer_secret) & _
						"&" & Server.URLEncode(oauth_token_secret)

		Dim oauth_signature : oauth_signature = b64_hmac_sha1(compositeKey, baseString)

		Dim headerFormat : headerFormat = "oauth_consumer_key=""{0}"", oauth_nonce=""{1}"", " & _
       		"oauth_signature=""{2}"", oauth_signature_method=""{3}"", " & _
       		"oauth_timestamp=""{4}"", oauth_token=""{5}"", " & _
	       	"oauth_version=""{6}"""

		Dim header : header = headerFormat
		header = Replace(header, "{0}", 			oauth_consumer_key)
		header = Replace(header, "{1}", 			oauth_nonce)
		header = Replace(header, "{2}", 			Server.URLEncode(oauth_signature))
		header = Replace(header, "{3}", 			oauth_signature_method)
		header = Replace(header, "{4}", 			oauth_timestamp)
		header = Replace(header, "{5}", 			oauth_token)
		header = Replace(header, "{6}", 			oauth_version)

		'Response.Write "<p><textarea rows=""2"" cols=""100"">" & baseString & "</textarea></p>" & vbCrLf
		'Response.Write "<p><textarea rows=""2"" cols=""100"">" & header & "</textarea></p>" & vbCrLf

		GetOAuthHeader = header

	End Function				

	Private Sub Class_Terminate()	
	End Sub

End Class

' Like URLEncode but for header parameters, for Twitter API.
Private Function HeaderEncodeParam(ByVal sParams)
	sParams = Replace(sParams, "=", "%3D")
	sParams = Replace(sParams, "&", "%26")
	HeaderEncodeParam = sParams
End Function

' Like URLEncode but for header values, for Twitter API.
Private Function HeaderEncodeValue(ByVal sValues)
	sValues = Replace(sValues, " ", "%20")	' Server.URLEncode encodes spaces as +.
	HeaderEncodeValue = sValues
End Function

' URLEncodes a URL for Twitter API headers.
' Reconcliles ideosyncracies of both Twitter and Classic ASP.
Private Function URLEncodeForHeader(ByVal sURL)
		sURL = Server.URLEncode(sURL)
		sURL = Replace(sURL, "%2E", ".") ' Twitter API does not expect URL encoding to encode dots.
		sURL = Replace(sURL, "%5F", "_") ' Twitter API does not expect URL encoding to encode underscores.
		sURL = Replace(sURL, "%2D", "-") ' Twitter API does not expect URL encoding to encode dashes.
		URLEncodeForHeader = sURL
End Function

%>
<!--#include file="VBScriptOAuth/oauth/_inc/hex_sha1_base64.asp"-->
<!--#include file="VBScriptOAuth/oauth/cLibOAuth.Utils.asp"-->
<!--#include file="VbsJson/VbsJson.asp"-->
<!--#include file="AXEJSONParser/AXEJSONParser.asp"-->