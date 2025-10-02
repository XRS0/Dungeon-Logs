package ru.max.searchingservice.filter;

import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import org.springframework.stereotype.Service;
import ru.max.searchingservice.entity.dto.LogFilter;

@Service
public interface LogSpecification {
    Query toQuery(LogFilter log);
}
