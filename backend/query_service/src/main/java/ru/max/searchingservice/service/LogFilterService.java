package ru.max.searchingservice.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.max.searchingservice.entity.dto.LogDto;
import ru.max.searchingservice.entity.dto.LogFilter;

public interface LogFilterService {
    Page<LogDto> searchLogs(LogFilter filter, Pageable pageable);
}
