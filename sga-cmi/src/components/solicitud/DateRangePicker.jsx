import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  FormLabel,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Grid,
  IconButton,
  Text,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
} from '@chakra-ui/icons';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addDays,
  subDays,
  subHours,
} from 'date-fns';
import { es } from 'date-fns/locale';

const DateRangePicker = ({ value, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({
    start: value?.inicio ? new Date(value.inicio) : null,
    end: value?.fin ? new Date(value.fin) : null,
  });
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    if (value) {
      setSelectedRange({
        start: value.inicio ? new Date(value.inicio) : null,
        end: value.fin ? new Date(value.fin) : null,
      });
    }
  }, [value]);

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const applyPreset = preset => {
    const now = new Date();
    let startDate;

    switch (preset) {
      case 'last4Hours':
        startDate = subHours(now, 4);
        break;
      case 'last24Hours':
        startDate = subHours(now, 24);
        break;
      case 'last2Days':
        startDate = subDays(now, 2);
        break;
      case 'last7Days':
        startDate = subDays(now, 7);
        break;

      default:
        startDate = null;
    }

    const newRange = { start: startDate, end: now };
    setSelectedRange(newRange);
    onChange({
      inicio: startDate?.toISOString() || null,
      fin: now.toISOString(),
    });
  };

  const handleDateClick = day => {
    if (!isSelecting) {
      setSelectedRange({ start: day, end: null });
      setIsSelecting(true);
    } else {
      if (day < selectedRange.start) {
        setSelectedRange({ start: day, end: selectedRange.start });
      } else {
        setSelectedRange({ ...selectedRange, end: day });
      }
      setIsSelecting(false);

      onChange({
        inicio: selectedRange.start.toISOString(),
        fin: day.toISOString(),
      });
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const isInRange = day => {
    if (!selectedRange.start || !selectedRange.end) return false;
    return isWithinInterval(day, {
      start: selectedRange.start,
      end: selectedRange.end,
    });
  };

  const formatDateDisplay = date => {
    if (!date) return 'Seleccionar fecha';
    return format(date, 'PPP', { locale: es });
  };

  return (
    <Box>
      <Flex mb={4} gap={2}>
        <Menu>
          <MenuButton as={Button} size="sm" variant="outline">
            Rangos predefinidos
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => applyPreset('last4Hours')}>
              Últimas 4 horas
            </MenuItem>
            <MenuItem onClick={() => applyPreset('last24Hours')}>
              Últimas 24 horas
            </MenuItem>
            <MenuItem onClick={() => applyPreset('last2Days')}>
              Últimos 2 días
            </MenuItem>
            <MenuItem onClick={() => applyPreset('last7Days')}>
              Últimos 7 días
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Flex mb={4} gap={2}>
        <Popover>
          <PopoverTrigger>
            <Button leftIcon={<CalendarIcon />} variant="outline" flex={1}>
              {selectedRange.start
                ? formatDateDisplay(selectedRange.start)
                : 'Fecha inicio'}
            </Button>
          </PopoverTrigger>
          <PopoverContent width="auto">
            <PopoverBody>
              <Flex align="center" justify="space-between" mb={4}>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  aria-label="Mes anterior"
                  onClick={handlePrevMonth}
                  size="sm"
                />
                <Text fontWeight="bold">
                  {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </Text>
                <IconButton
                  icon={<ChevronRightIcon />}
                  aria-label="Mes siguiente"
                  onClick={handleNextMonth}
                  size="sm"
                />
              </Flex>

              <Grid templateColumns="repeat(7, 1fr)" gap={1}>
                {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
                  <Text
                    key={day}
                    textAlign="center"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    {day}
                  </Text>
                ))}

                {daysInMonth.map(day => {
                  const isSelectedStart =
                    selectedRange.start && isSameDay(day, selectedRange.start);
                  const isSelectedEnd =
                    selectedRange.end && isSameDay(day, selectedRange.end);
                  const isInSelectedRange = isInRange(day);

                  return (
                    <Button
                      key={day}
                      size="sm"
                      variant={
                        isSelectedStart || isSelectedEnd
                          ? 'solid'
                          : isInSelectedRange
                          ? 'outline'
                          : 'ghost'
                      }
                      colorScheme={
                        isSelectedStart || isSelectedEnd ? 'blue' : undefined
                      }
                      onClick={() => handleDateClick(day)}
                      disabled={!isSameMonth(day, currentMonth)}
                      borderRadius="full"
                    >
                      {format(day, 'd')}
                    </Button>
                  );
                })}
              </Grid>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger>
            <Button leftIcon={<CalendarIcon />} variant="outline" flex={1}>
              {selectedRange.end
                ? formatDateDisplay(selectedRange.end)
                : 'Fecha fin'}
            </Button>
          </PopoverTrigger>
          <PopoverContent width="auto">
            <PopoverBody>
              <Flex align="center" justify="space-between" mb={4}>
                <IconButton
                  icon={<ChevronLeftIcon />}
                  aria-label="Mes anterior"
                  onClick={handlePrevMonth}
                  size="sm"
                />
                <Text fontWeight="bold">
                  {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </Text>
                <IconButton
                  icon={<ChevronRightIcon />}
                  aria-label="Mes siguiente"
                  onClick={handleNextMonth}
                  size="sm"
                />
              </Flex>

              <Grid templateColumns="repeat(7, 1fr)" gap={1}>
                {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
                  <Text
                    key={day}
                    textAlign="center"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    {day}
                  </Text>
                ))}

                {daysInMonth.map(day => {
                  const isSelectedStart =
                    selectedRange.start && isSameDay(day, selectedRange.start);
                  const isSelectedEnd =
                    selectedRange.end && isSameDay(day, selectedRange.end);
                  const isInSelectedRange = isInRange(day);

                  return (
                    <Button
                      key={day}
                      size="sm"
                      variant={
                        isSelectedStart || isSelectedEnd
                          ? 'solid'
                          : isInSelectedRange
                          ? 'outline'
                          : 'ghost'
                      }
                      colorScheme={
                        isSelectedStart || isSelectedEnd ? 'blue' : undefined
                      }
                      onClick={() => handleDateClick(day)}
                      disabled={!isSameMonth(day, currentMonth)}
                      borderRadius="full"
                    >
                      {format(day, 'd')}
                    </Button>
                  );
                })}
              </Grid>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>

      <Flex gap={2}>
        <Box flex={1}>
          <FormLabel>Hora inicio</FormLabel>
          <Input
            type="time"
            value={
              selectedRange.start ? format(selectedRange.start, 'HH:mm') : ''
            }
            onChange={e => {
              if (!selectedRange.start) return;
              const [hours, minutes] = e.target.value.split(':');
              const newDate = new Date(selectedRange.start);
              newDate.setHours(parseInt(hours), parseInt(minutes));
              setSelectedRange({ ...selectedRange, start: newDate });
              onChange({
                inicio: newDate.toISOString(),
                fin: selectedRange.end?.toISOString() || null,
              });
            }}
          />
        </Box>
        <Box flex={1}>
          <FormLabel>Hora fin</FormLabel>
          <Input
            type="time"
            value={selectedRange.end ? format(selectedRange.end, 'HH:mm') : ''}
            onChange={e => {
              if (!selectedRange.end) return;
              const [hours, minutes] = e.target.value.split(':');
              const newDate = new Date(selectedRange.end);
              newDate.setHours(parseInt(hours), parseInt(minutes));
              setSelectedRange({ ...selectedRange, end: newDate });
              onChange({
                inicio: selectedRange.start?.toISOString() || null,
                fin: newDate.toISOString(),
              });
            }}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default DateRangePicker;
