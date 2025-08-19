package com.blog.jwtauthblog;

//import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JwtAuthBlogApplication {

	public static void main(String[] args) {
//		Dotenv dotenv = Dotenv.configure()
//				.directory("./")
//				.filename(".env")
//				.load();
//		dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue())
//		);
		SpringApplication.run(JwtAuthBlogApplication.class, args);
	}

}
