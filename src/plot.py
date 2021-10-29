from datetime import datetime
import dateutil.parser
import matplotlib.pyplot as plt
import json

validation_limbo_series = json.load(open('validation_limbo_series.json'))
integration_limbo_series = json.load(open('integration_limbo_series.json'))
integrated_limbo_series = json.load(open('integrated_limbo_series.json'))
timestamp_series = json.load(open('timestamp_series.json'))
timestamp_series = [dateutil.parser.isoparse(timestamp) for timestamp in timestamp_series]

# plotting the points
plt.plot(timestamp_series, validation_limbo_series, label="validation_limbo_series")
plt.plot(timestamp_series, integration_limbo_series, label="integration_limbo_series")
plt.plot(timestamp_series, integrated_limbo_series, label="integrated_limbo_series")

# naming the x axis
plt.xlabel('x - axis')
# naming the y axis
plt.ylabel('y - axis')
 
# giving a title to my graph
plt.title('Full limbo state')
 
# function to show the plot
plt.legend(loc='best')
plt.savefig("./graphs/full_limbo_state.jpg")
plt.clf()

# plotting the points
plt.plot(timestamp_series, validation_limbo_series, label="validation_limbo_series")

# naming the x axis
plt.xlabel('x - axis')
# naming the y axis
plt.ylabel('y - axis')
 
# giving a title to my graph
plt.title('Validation limbo')
 
# function to show the plot
plt.legend(loc='best')
plt.savefig("./graphs/validation_limbo_series.jpg")
plt.clf()

plt.plot(timestamp_series, integration_limbo_series, label="integration_limbo_series")

# naming the x axis
plt.xlabel('x - axis')
# naming the y axis
plt.ylabel('y - axis')
 
# giving a title to my graph
plt.title('Integration limbo')
 
# function to show the plot
plt.legend(loc='best')
plt.savefig("./graphs/integration_limbo_series.jpg")
plt.clf()

plt.plot(timestamp_series, integrated_limbo_series, label="integrated_limbo_series")

# naming the x axis
plt.xlabel('x - axis')
# naming the y axis
plt.ylabel('y - axis')
 
# giving a title to my graph
plt.title('Integrated limbo')
 
# function to show the plot
plt.legend(loc='best')
plt.savefig("./graphs/integrated_limbo_series.jpg")
plt.clf()
