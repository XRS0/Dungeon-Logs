package ru.max.servicesendingjson.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import ru.max.servicesendingjson.LogsSenderService;

@Controller
@RequiredArgsConstructor
public class LogHandler {
    private final LogsSenderService logsSenderService;

    @MessageMapping("/glog")
    //@SendTo("/topic/logs")
    public void send(){
        logsSenderService.send();
    }

}
