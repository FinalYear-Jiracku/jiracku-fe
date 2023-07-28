export const INFO_FORM = [
    {
      id: 1,
      name: "name",
      label: "Issue Name",
      type: "input",
      require: true,
      error: "Please input your Issue Name!",
    },
    {
      id: 2,
      name: "type",
      label: "Type",
      type: "select",
      require: true,
      error: "Please Select Type",
      children: [
        {
          id: 1,
          name: "Task",
        },
        {
          id: 2,
          name: "Bug",
        },
      ],
    },
    {
      id: 3,
      name: "priority",
      label: "Priority",
      type: "select",
      require: true,
      error: "Please Select Priority",
      children: [
        {
          id: 1,
          name: "Urgent",
        },
        {
          id: 2,
          name: "High",
        },
        {
          id: 3,
          name: "Normal",
        },
        {
          id: 4,
          name: "Low",
        },
      ],
    },
    {
      id: 4,
      name: "storyPoint",
      label: "Story Point",
      type: "input",
      require: false,
      error: "",
    },
    {
      id: 5,
      name: "statusId",
      label: "Status",
      type: "select",
      require: false,
      error: "",
    },
    {
      id: 6,
      name: "startDate",
      label: "Start Date",
      type: "date",
      require: false,
      error: "",
    },
    {
      id: 7,
      name: "dueDate",
      label: "Due Date",
      type: "date",
      require: false,
      error: "",
    },
  ];
  
  const typeOptions = INFO_FORM[1].children.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const priorityOptions = INFO_FORM[2].children.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const selectData = {
    type: typeOptions,
    priority: priorityOptions,
  };
  export const dataSelectOption = (nameField) => selectData[nameField];
  