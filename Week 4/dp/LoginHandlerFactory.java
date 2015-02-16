package dp;

public class LoginHandlerFactory {

	public static LoginHandler getLoginHandler(String domainName) {

		if (domainName == null) {
			throw new IllegalArgumentException("Domain name must not be null");
		}
		domainName = domainName.toUpperCase();

		LoginHandler domain = null;

		switch (domainName) {
		case "GOOGLE":
			domain = new GoogleLoginHandler();
			break;

		case "FACEBOOK":
			domain = new FacebookLoginHandler();
			break;

		case "YAHOO":
			domain = new YahooLoginHandler();
			break;

		case "TWITTER":
			domain = new TwitterLoginHandler();
			break;
		default:
			throw new IllegalArgumentException("Unknown domain : " + domainName);
		}
		return domain;

	}

	public static void main(String[] args) {
		LoginHandler googleLoginHandler = LoginHandlerFactory
				.getLoginHandler("google");
		googleLoginHandler.login("abcdef@gmail.com", "123456");
		googleLoginHandler.login("abcdef@gmail.com", "123");
	}

}
