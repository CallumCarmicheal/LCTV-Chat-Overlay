# Create a random message
```var test = new msgObject(); 
test.Settings.Username = "Index @ " + x; 
test.Settings.Message = "Hello World"; 
test.Create();```

# Create A bunch of random messages
```var objs = [];

for(var x = 0; x < 30; x++) {
	var test = new msgObject(); 
	test.Settings.Username = "Index @ " + x; 
	test.Settings.Message = "Hello World"; 
	test.Create();
	
	objs.push(test);
}```