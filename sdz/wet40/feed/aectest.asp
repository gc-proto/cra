<%
' =================================================

' Configure Twitter API authentication.
' TODO: Enter your own consumer key and consumer secret here so the code can log you in.
' Get your consumer key and consumer secret here: https://dev.twitter.com/apps
' NOTE: These are dummy values and will not work.

Response.CodePage = 65001

' cra keys
const TWITTER_API_CONSUMER_KEY    =		"93u2J58wqCuZJiZj9WhFC6JK8"
const TWITTER_API_CONSUMER_SECRET =		"sr3lV5JDd0f9mEn3qHP1CxkXvnRnCgCvsCmzBJljgAvXCavtxm"

' jason keys
'const TWITTER_API_CONSUMER_KEY    =       "2Sykh8B1DjPrSuoTkCsSImXpL"
'const TWITTER_API_CONSUMER_SECRET =    "p44E0kEVghTrJO6CFzYmpk5azVdbFZK3ToACse0ZkOkEmjzxU2"


const CACHE_DURATION_SEC =				600 '20 minutes (in seconds)

' Twitter API client.
Dim objASPTwitter
Set objASPTwitter = New ASPTwitter

' Tweets will be obtained by parsing data from Twitter API.
Dim objTweets
Set objTweets = Nothing

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'	
%><%= GetCachedTweetsHTML %><%
Response.Flush()
'
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Function GetCachedTweetsHTML
	Dim sHTML
	If IsCacheExpired Then
		call TwitterFeed_Load ("CanRevAgency", 15)
		sHTML = CreateTweetsUserTimelineHTML
		With Application
			.Lock()
			.Contents.Item("HOME_TWEETS_CACHE_KEY") = sHTML
			.Contents.Item("HOME_TWEETS_UPDATED_CACHE_KEY") = Now()
			.Unlock()
		End With
	Else
		sHTML = CStr("" & Application.Contents.Item("HOME_TWEETS_CACHE_KEY"))
	End If
	GetCachedTweetsHTML = sHTML
End Function

Private Function IsCacheExpired
	IsCacheExpired = True
	If IsDate(Application.Contents.Item("HOME_TWEETS_UPDATED_CACHE_KEY")) Then
		Dim dUpdated : dUpdated = CDate(Application.Contents.Item("HOME_TWEETS_UPDATED_CACHE_KEY"))
		If DateAdd("s", CACHE_DURATION_SEC, dUpdated) > Now() Then
			IsCacheExpired = False
			Exit Function
		End If
	End If
End Function

Public Sub TwitterFeed_Load(sUsername, iCount)
	'On Error Resume Next
	Call objASPTwitter.Configure(TWITTER_API_CONSUMER_KEY, TWITTER_API_CONSUMER_SECRET)
	
	'objASPTwitter.Login

	'Response.Write "<textarea>"	 & objASPTwitter.strBearerToken & "<textarea>"
	
	objASPTwitter.strBearerToken = "AAAAAAAAAAAAAAAAAAAAAMl8WwAAAAAAzza1zr3ymC6pE%2BVKqJar77FLAts%3Dcts17PC4PeYGhkuJpMdrFlZuJysBieA1qAtmLuYZXh0UQVPKow"

	'objASPTwitter.strBearerToken = "AAAAAAAAAAAAAAAAAAAAAMl8WwAAAAAAzza1zr3ymC6pE%2BVKqJar77FLAts%3Dcts17PC4PeYGhkuJpMdrFlZuJysBieA1qAtmLuYZXh0UQVPKow"

	Dim bExcludeReplies : bExcludeReplies = False
	Dim bIncludeRTs : bIncludeRTs = True
	
	Set objTweets = objASPTwitter.GetUserTimeline(sUsername, iCount, bExcludeReplies, bIncludeRTs)
End Sub

Function CreateTweetsUserTimelineHTML()
	Dim boolProcessTweetObj
	Dim HTMLContent
	HTMLContent = ""
	HTMLContent = HTMLContent & "<!--h2>User Timeline</h2-->"
	HTMLContent = HTMLContent & "<!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">"
	HTMLContent = HTMLContent & "<html xmlns=""http://www.w3.org/1999/xhtml"">"
	HTMLContent = HTMLContent & "<head>"
	HTMLContent = HTMLContent & "<meta http-equiv=X-UA-Compatible content=""IE=Edge"">"
	HTMLContent = HTMLContent & "<meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"" />"
	HTMLContent = HTMLContent & "<style>"
	HTMLContent = HTMLContent & "	body {color: #333;font-family: ""Helvetica Neue"",Helvetica,Arial,sans-serif;font-size: 16px;line-height: 1.4375;}"
	HTMLContent = HTMLContent & "	ul{padding:0;margin:0;}"
	HTMLContent = HTMLContent & "	li{padding:10px;border-top:1px solid #eee;list-style:none;display:inline-block;}"
	HTMLContent = HTMLContent & "	li:first-child{border-top:none;}"
	HTMLContent = HTMLContent & "	ul li:before {width:40px; content: "" "";display: inline-block; float:left; margin-bottom:10px;height:35px; background-repeat:no-repeat;background-position:0 3px;}"
	HTMLContent = HTMLContent & "	ul li:before {background-image: url(/wet40/intranet/images/twitter-cra-en.jpg);}"
	HTMLContent = HTMLContent & "</style>"
	HTMLContent = HTMLContent & "</head>"
	HTMLContent = HTMLContent & "	<ul id=""Tweets"">"
	
	boolProcessTweetObj = True
	'If UBound(objTweets) = 0 Then
	'	HTMLContent = HTMLContent & "<li>Tweets.asp: No tweets.</li>"
	'	boolProcessTweetObj = False
	'End If

	If Err Then
		HTMLContent = HTMLContent & "<li>Tweets.asp: invalid API response.</li>"
		boolProcessTweetObj = False
	End if

	If boolProcessTweetObj Then
		Dim oTweet
		For Each oTweet In objTweets
			' Workarounds.
			' JSON parser bug workaround:
			'	- API can return invalid tweets, probably due to characters.
			' Twitter API bugs:
			'	- Filtering by the API can return additional invalid items, and seems to filter only after retrieving the requested number of items, so you get less than you asked for.
			'	- API sometimes seems to exclude replies even if that filter is not set, resulting in "*up to* count" responses and associated issues.
			If IsTweet(oTweet) Or IsRetweet(oTweet) Then
				' NOTE: A JSON viewer can be useful here: http://www.jsoneditoronline.org/
				Dim screen_name, text
				If Not IsRetweet(oTweet) Then
					screen_name = oTweet.user.screen_name
					text = URLsBecomeLinks(oTweet.text)
				Else 
					screen_name = oTweet.retweeted_status.user.screen_name
					text = URLsBecomeLinks(oTweet.retweeted_status.text)
				End If
				HTMLContent = HTMLContent & "	<li>"
				HTMLContent = HTMLContent & "		<strong>@" & screen_name & "</strong>"
				HTMLContent = HTMLContent & "		<span class="""">" & text & "</span>"
				HTMLContent = HTMLContent & "	</li>"
			End If
		Next
		HTMLContent = HTMLContent & "</ul>"
	End If
	HTMLContent = HTMLContent & "testing123</html>"
	HTMLContent = HTMLContent & "</html>"
	
	CreateTweetsUserTimelineHTML = HTMLContent
End Function

Function IsTweet(ByRef oTweet)
	IsTweet = HasKey(oTweet, "user") 
End Function

Function IsRetweet(ByRef oTweet)
	IsRetweet = HasKey(oTweet, "retweeted_status") 
End Function

Function IsReply(ByRef oTweet)
	IsReply = Not oTweet.get("in_reply_to_user_id") = Null
End Function

Function HasKey(ByRef oTweet, ByVal sKeyName)
	HasKey = Not CStr("" & oTweet.get(sKeyName)) = ""
End Function

Function URLsBecomeLinks(sText)
	' Wrap URLs in text with HTML link anchor tags.
	Dim objRegExp
	Set objRegExp = New RegExp
	objRegExp.Pattern = "(https*://[^\s<]*)"
	objRegExp.Global = True
	objRegExp.ignorecase = True
	UrlsBecomeLinks = "" & objRegExp.Replace(sText, "<a href=""$1"" target=""_blank"">$1</a>")
	Set objRegExp = Nothing
End Function
%>
<!--#include virtual="/wet40/twitter/Libs/ASPTwitter.asp"-->

