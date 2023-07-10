export const INFO_FORM = [
    {
      id: 1,
      type: "input",
      children: [
        {
          id: 1,
          name: "name",
          label: "Issue Name",
          type: "input",
          require: true,
          error: "Please input your Issue Name!",
        },
      ],
    },
    {
      id: 2,
      type: "input",
      children: [
        {
          id: 1,
          name: "type",
          label: "Type",
          type: "select",
          require: false,
          error: "",
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
          id: 2,
          name: "priority",
          label: "Priority",
          type: "select",
          require: false,
          error: "",
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
      ],
    },
    {
      id: 3,
      type: "input",
      children: [
        {
          id: 1,
          name: "storyPoint",
          label: "Story Point",
          type: "input",
          require: false,
          error: "",
        },
        {
          id: 2,
          name: "statusId",
          label: "Status",
          type: "select",
          require: false,
          error: "",
        },
      ],
    },
    {
      id: 4,
      type: "input",
      children: [
        {
          id: 1,
          name: "userIssues",
          label: "Assignee",
          type: "select",
          require: false,
          error: "",
        },
      ],
    },
    {
      id: 5,
      type: "input",
      children: [
        {
          id: 1,
          name: "startDate",
          label: "Start Date",
          type: "date",
          require: false,
          error: "",
        },
        {
          id: 2,
          name: "dueDate",
          label: "Due Date",
          type: "date",
          require: false,
          error: "",
        },
      ],
    },
    {
      id: 6,
      type: "input",
      children: [
        {
          id: 1,
          name: "description",
          label: "Description",
          type: "textArea",
          require: false,
          error: "",
        },
      ],
    },
    {
      id: 7,
      type: "input",
      children: [
        {
          id: 1,
          name: "files",
          label: "Files",
          type: "files",
          require: false,
          error: "",
          children: []
        },
      ],
    },
  ];
  
  const typeOptions = INFO_FORM[1].children[0].children.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const priorityOptions = INFO_FORM[1].children[1].children.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const selectData = {
    type: typeOptions,
    priority: priorityOptions,
  };
  export const dataSelectOption = (nameField) => selectData[nameField];
  